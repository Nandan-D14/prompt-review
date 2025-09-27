# main.py - Comprehensive Prompt Review Engine Backend
import os
import re
import json
import time
import typing as t
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Config from env ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash")
GEMINI_ENDPOINT = os.getenv("GEMINI_API_URL", "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
USE_STUB = os.getenv("USE_STUB", "false").lower() in ("1", "true", "yes")

# Simple slang and suspicious patterns (extend for hackathon)
COMMON_SLANG = {"oi", "bruh", "wtf", "wanna", "gonna", "sus", "lol", "yeet", "slay", "fire", "bet", "fuck", "fucking", "shit", "damn"}
# a few Kannada Unicode words example: (you can extend)
KANNADA_UNICODE_REGEX = re.compile(r"[\u0C80-\u0CFF]")

# Prompt injection patterns (simple heuristics)
INJECTION_PATTERNS = [
    r"ignore (the )?above",
    r"ignore previous instructions",
    r"disregard.*above",
    r"follow only the instructions below",
    r"override system prompt",
    r"do anything now",
    r"jailbreak",
    r"pretend you are",
    r"act as if you are not an ai",
]

# Explicit content patterns (strict filtering)
EXPLICIT_PATTERNS = [
    r"\bf+u+c+k+\b",
    r"\bs+e+x+\b", 
    r"\bp+o+r+n+\b",
    r"\bn+u+d+e+\b",
    r"\bg+i+r+l+s?\s+.*(hard|fuck|sex)",
    r"hard.*fuck.*with.*\d+.*girls?",
    r"\b(sexual|erotic|xxx|adult)\b",
    r"\b(prostitut|escort|hookup)\b",
    r"\b(masturbat|orgasm|climax)\b",
    r"\b(penis|vagina|breast|ass|dick|cock|pussy)\b",
    r"want.*to.*(fuck|have sex|sleep with)",
    r"looking for.*(sex|hookup|adult fun)",
]

# Violent/harmful content patterns
HARMFUL_PATTERNS = [
    r"\b(kill|murder|suicide|self.?harm)\b",
    r"\b(bomb|explosive|weapon|gun)\b",
    r"\b(drug|cocaine|heroin|meth)\b",
    r"how to (hurt|harm|attack|assault)",
    r"ways to (die|kill|harm)",
]

app = FastAPI(title="Prompt Review Engine - Backend")

# Allow CORS from localhost/frontend (adjust for deploy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:5178", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# --- Pydantic models ---
class AnalyzeRequest(BaseModel):
    prompt: str
    persona: t.Optional[str] = "Professor"   # Professor | Guardian | Shield
    options: t.Optional[dict] = None

class AnalyzeResponse(BaseModel):
    verdict: str           # ALLOW | NEEDS_FIX | BLOCK
    score: int             # 0-100
    costar: dict
    highlights: t.List[dict]
    suggested_rewrite: str
    reasons: t.List[str]

class ChatRequest(BaseModel):
    prompt: str
    persona: t.Optional[str] = "Professor"
    options: t.Optional[dict] = None

class ChatResponse(BaseModel):
    allowed: bool
    analysis: AnalyzeResponse
    llm_response: t.Optional[str] = None

# --- Helper utilities ---

def detect_mixed_language(text: str) -> dict:
    """Detect presence of Kannada (unicode) and return flags."""
    has_kannada = bool(KANNADA_UNICODE_REGEX.search(text))
    # naive transliteration detection: presence of common transliterated tokens like 'nanna','nimm' etc could be added
    return {"has_kannada": has_kannada}

def detect_slang_and_ambiguity(text: str) -> t.List[dict]:
    words = re.findall(r"\w+['']?\w*|\S+", text.lower())
    findings = []
    for w in words:
        if w in COMMON_SLANG:
            findings.append({"type":"slang","token":w,"reason":"inappropriate_language"})
    
    # Check for explicit content
    for pattern in EXPLICIT_PATTERNS:
        if re.search(pattern, text, re.I):
            findings.append({"type":"explicit","token":"[BLOCKED]","reason":"sexual_or_explicit_content"})
    
    # Check for harmful content
    for pattern in HARMFUL_PATTERNS:
        if re.search(pattern, text, re.I):
            findings.append({"type":"harmful","token":"[BLOCKED]","reason":"violent_or_harmful_content"})
    
    # double-meaning heuristics: presence of "hack" + "how to" etc.
    if re.search(r"\bhack\b", text, re.I):
        findings.append({"type":"risky","token":"hack","reason":"potential_illicit_intent"})
    # ambiguous question like "is it ok to..." - low confidence marker
    if re.search(r"\bis it ok to\b", text, re.I):
        findings.append({"type":"ambiguous","token":"is it ok to","reason":"ambiguous_intent"})
    
    return findings

def detect_injection(text: str) -> t.List[dict]:
    matches = []
    for p in INJECTION_PATTERNS:
        if re.search(p, text, re.I):
            matches.append({"pattern":p, "match": re.search(p, text, re.I).group(0)})
    # also detect overt system tokens like "<system>" or "SYSTEM:"
    if re.search(r"<system>|system:", text, re.I):
        matches.append({"pattern":"system_token","match":"contains system token"})
    return matches

def simple_costar_extract(text: str) -> dict:
    # Very light heuristics; for hackathon this is acceptable. You can improve with an LLM call.
    lower = text.lower()
    context = ""
    objective = ""
    style = ""
    tone = ""
    audience = ""
    response = ""

    # Context: keywords
    if "ai" in lower or "artificial intelligence" in lower or "machine learning" in lower:
        context = "AI"
    if "wifi" in lower or "wi-fi" in lower or "network" in lower:
        context = (context + ", Network").strip(", ")

    # Objective
    if re.search(r"\bexplain|describe|what is\b", lower):
        objective = "Explain"
    if re.search(r"\bgenerate|write|create|compose\b", lower):
        objective = "Generate"

    # Style & tone
    if "tweet" in lower:
        style = "Tweet-length"
    if "funny" in lower or "humor" in lower or "joke" in lower:
        tone = "Humorous"
    if "formal" in lower or "professional" in lower:
        tone = "Professional"
    # Audience
    if "students" in lower or "student" in lower:
        audience = "Students"
    if "twitter" in lower or "tweet" in lower:
        audience = "Twitter readers"

    # Response type
    if re.search(r"\bcode\b|\bscript\b|\bprogram\b", lower):
        response = "Code"
    if re.search(r"\bsummary|summarize\b", lower):
        response = "Summary"
    if response == "" and objective:
        response = objective

    return {
        "Context": context or "None",
        "Objective": objective or "None",
        "Style": style or "None",
        "Tone": tone or "None",
        "Audience": audience or "General",
        "Response": response or "Text"
    }

def compute_score(issues: int, costar: dict) -> int:
    # Simple scoring: base 100, subtract per issue, clamp
    score = max(0, 100 - issues*18)
    # adjust if no costar context
    if costar.get("Context") in ("", "None"):
        score -= 5
    return max(0, min(100, score))

def decide_verdict(issues_count: int, injection_found: bool, highlights: t.List[dict]) -> str:
    # Check for explicit or harmful content - always BLOCK
    for highlight in highlights:
        if highlight.get("type") in ["explicit", "harmful"]:
            return "BLOCK"
    
    # Check for injection attacks
    if injection_found:
        return "BLOCK"
    
    # Check for multiple slang words - stricter enforcement
    slang_count = sum(1 for h in highlights if h.get("type") == "slang")
    if slang_count >= 2:  # Multiple profanity words = BLOCK
        return "BLOCK"
        
    if issues_count == 0:
        return "ALLOW"
    if issues_count <= 1:
        return "NEEDS_FIX"
    return "BLOCK"

def build_sanitized_rewrite(prompt: str, costar: dict, persona: str) -> str:
    # For inappropriate content, provide completely different professional prompts
    # Never try to sanitize explicit/harmful content - replace entirely
    
    # Check if original prompt contains explicit or harmful content
    contains_explicit = any(re.search(pattern, prompt, re.I) for pattern in EXPLICIT_PATTERNS)
    contains_harmful = any(re.search(pattern, prompt, re.I) for pattern in HARMFUL_PATTERNS)
    contains_profanity = any(word in prompt.lower() for word in COMMON_SLANG if word in ['fuck', 'fucking', 'shit', 'damn'])
    
    if contains_explicit or contains_harmful or contains_profanity:
        # Return professional alternatives based on persona
        if persona == "Professor":
            return "Could you help me understand a complex topic in a clear and educational way?"
        elif persona == "Guardian":
            return "I'd like guidance on making responsible and ethical decisions."
        else:  # Shield
            return "Please provide information about best practices for online safety and security."
    
    # For non-explicit content, do light sanitization
    base = prompt
    base = re.sub(r"\bhack\b", "learn about cybersecurity concepts related to", base, flags=re.I)
    base = re.sub(r"\bpassword\b", "authentication security regarding", base, flags=re.I)
    base = re.sub(r"\bcrack\b", "understand the security of", base, flags=re.I)
    base = re.sub(r"\bsteal\b", "learn about protecting", base, flags=re.I)
    
    # Remove any remaining slang
    for word in COMMON_SLANG:
        if word not in ['fuck', 'fucking', 'shit', 'damn']:  # These should trigger full replacement above
            base = re.sub(r"\b" + re.escape(word) + r"\b", "", base, flags=re.I)
    
    # Clean up extra spaces
    base = re.sub(r'\s+', ' ', base).strip()
    
    # If result is too short or empty, provide default
    if len(base) < 10:
        return "Could you help me with a professional and educational request?"
    
    return base

# --- Gemini client (simple wrapper) ---
def call_gemini_generate(prompt: str, model: str = GEMINI_MODEL, max_tokens: int = 512) -> str:
    """
    Calls Google Generative Language API (Gemini) v1beta generateContent endpoint.
    """
    if USE_STUB or not GEMINI_API_KEY:
        # Local stub
        return stub_llm_response(prompt)
    
    # Build endpoint
    endpoint = GEMINI_ENDPOINT
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY
    }
    
    body = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "maxOutputTokens": max_tokens,
            "temperature": 0.7
        }
    }
    
    try:
        r = requests.post(endpoint, headers=headers, json=body, timeout=20)
        r.raise_for_status()
        data = r.json()
        
        # Extract response from Gemini API format
        if "candidates" in data and data["candidates"]:
            candidate = data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if parts and "text" in parts[0]:
                    return parts[0]["text"]
        
        # Fallback
        return json.dumps(data)[:2000]
        
    except Exception as e:
        # fallback to stub
        print("Gemini call failed:", str(e))
        return stub_llm_response(prompt)

def stub_llm_response(prompt: str) -> str:
    # Intelligent stub responses based on content analysis
    prompt_lower = prompt.lower()
    
    # Educational content
    if any(term in prompt_lower for term in ['explain', 'teach', 'learn', 'understand', 'concept']):
        if 'quantum' in prompt_lower and 'physics' in prompt_lower:
            return """**Quantum Physics Simplified for High School Students**

**What is Quantum Physics?**
Quantum physics is the study of matter and energy at the tiniest scale - smaller than atoms! At this microscopic level, particles behave in strange and fascinating ways that are completely different from our everyday experience.

**Key Concepts:**

1. **Wave-Particle Duality**
   - Light and particles can act like both waves and particles
   - Think of it like a coin that's spinning - it's both heads AND tails until it lands

2. **Uncertainty Principle** 
   - We can't know both the exact position and speed of a particle at the same time
   - It's like trying to photograph a hummingbird - the more precisely you capture its location, the blurrier its motion becomes

3. **Quantum Superposition**
   - Particles can exist in multiple states simultaneously
   - Famous example: Schrödinger's cat being both alive and dead until observed

4. **Quantum Entanglement**
   - Two particles can be mysteriously connected across vast distances
   - Einstein called this "spooky action at a distance"

**Why Does This Matter?**
Quantum physics enables technologies like lasers, MRI machines, computer processors, and could lead to quantum computers that solve problems impossible for regular computers.

**Analysis Reasoning:** This prompt was educational, appropriate, and requested clear explanations for students - exactly the type of content our system is designed to support and encourage."""

        elif any(term in prompt_lower for term in ['ai', 'artificial intelligence', 'machine learning']):
            return """**Artificial Intelligence Explained Simply**

**What is AI?**
Artificial Intelligence is technology that enables computers to perform tasks that typically require human intelligence, such as learning, reasoning, and problem-solving.

**Key Types:**

1. **Narrow AI** - Specialized for specific tasks (like chess, image recognition)
2. **Machine Learning** - Systems that improve through experience
3. **Deep Learning** - AI inspired by how human brains process information

**Real-World Applications:**
- Voice assistants (Siri, Alexa)
- Recommendation systems (Netflix, YouTube)
- Medical diagnosis assistance
- Autonomous vehicles

**Analysis Reasoning:** This educational request about AI concepts is appropriate and aligns with promoting understanding of important technologies."""

    # Programming/coding requests
    if any(term in prompt_lower for term in ['code', 'programming', 'software', 'algorithm']):
        return """**Programming Concepts Explained**

Programming is the art of giving computers step-by-step instructions to solve problems. Here are key concepts:

**Fundamental Principles:**
1. **Variables** - Storage containers for data
2. **Functions** - Reusable blocks of code
3. **Loops** - Repeating actions efficiently
4. **Conditionals** - Making decisions in code

**Best Practices:**
- Write clean, readable code
- Plan before you code
- Test your programs thoroughly
- Learn from errors and debugging

**Analysis Reasoning:** Educational programming content promotes learning and skill development in technology."""

    # Professional communication
    if any(term in prompt_lower for term in ['professional', 'business', 'email', 'communication']):
        return """**Professional Communication Guidelines**

**Key Principles:**
1. **Clarity** - Be clear and direct in your message
2. **Courtesy** - Use polite and respectful language
3. **Conciseness** - Keep messages focused and brief
4. **Correctness** - Check grammar and factual accuracy

**Structure for Professional Emails:**
- Clear subject line
- Polite greeting
- Specific purpose/request
- Next steps or timeline
- Professional closing

**Analysis Reasoning:** This request for professional communication guidance promotes workplace skills and appropriate conduct."""

    # General educational response
    return """**Educational Response**

I'd be happy to help you learn! For the most comprehensive and accurate information on this topic, I recommend:

**Learning Strategies:**
1. Break complex topics into smaller parts
2. Use multiple sources to verify information
3. Apply concepts through practice and examples
4. Ask specific questions for targeted learning

**Quality Resources:**
- Educational websites (.edu domains)
- Peer-reviewed academic sources
- Established educational institutions
- Professional learning platforms

**Analysis Reasoning:** This prompt requested educational content, which aligns with promoting learning and knowledge sharing - core values our system is designed to support."""

# --- Pipeline endpoint implementations ---

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    prompt = req.prompt or ""
    persona = req.persona or "Professor"

    # Step 1: language detection / mixed-language
    lang_info = detect_mixed_language(prompt)

    # Step 2: slang & ambiguity detection
    slang_hits = detect_slang_and_ambiguity(prompt)

    # Step 3: injection detection
    injection_hits = detect_injection(prompt)
    injection_found = len(injection_hits) > 0

    # Step 4: costar extraction
    costar = simple_costar_extract(prompt)

    # Step 5: build highlights & reasons
    highlights = []
    reasons = []
    for s in slang_hits:
        highlights.append({"type": s["type"], "token": s["token"], "reason": s["reason"]})
        reasons.append(f"{s['type']}: {s['token']} ({s['reason']})")
    for inj in injection_hits:
        highlights.append({"type": "injection", "match": inj})
        reasons.append(f"injection pattern matched: {inj['match']}")

    # flag mixed language
    if lang_info["has_kannada"]:
        highlights.append({"type":"mixed_language","match":"kannada_unicode_present"})
        reasons.append("Mixed-language: Kannada characters detected")

    # Score & verdict
    issues_count = len(highlights)
    score = compute_score(issues_count, costar)
    verdict = decide_verdict(issues_count, injection_found, highlights)

    # Suggested rewrite (always use safe fallback for inappropriate content)
    suggested_rewrite = ""
    
    # Check if content is inappropriate - if so, skip Gemini and use safe fallback
    contains_inappropriate = any([
        any(re.search(pattern, prompt, re.I) for pattern in EXPLICIT_PATTERNS),
        any(re.search(pattern, prompt, re.I) for pattern in HARMFUL_PATTERNS),
        any(word in prompt.lower() for word in COMMON_SLANG if word in ['fuck', 'fucking', 'shit', 'damn'])
    ])
    
    if contains_inappropriate or verdict == "BLOCK":
        # For blocked content, always use safe local rewrite
        suggested_rewrite = build_sanitized_rewrite(prompt, costar, persona)
    else:
        # Only call Gemini for appropriate content
        try:
            rewrite_prompt = (
                f"Rewrite the following user prompt to be more professional and clear.\n"
                f"Original prompt: '''{prompt}'''\n"
                f"Persona: {persona}\n"
                f"Provide only a clean, professional version (one sentence)."
            )
            suggested_rewrite = call_gemini_generate(rewrite_prompt, max_tokens=256)

            # If gemini returned stub, empty, or malformed JSON, fallback
            if (not suggested_rewrite or 
                suggested_rewrite.startswith("STUB LLM RESPONSE") or 
                suggested_rewrite.startswith("{") or
                len(suggested_rewrite) > 200):
                suggested_rewrite = build_sanitized_rewrite(prompt, costar, persona)
        except:
            suggested_rewrite = build_sanitized_rewrite(prompt, costar, persona)

    return AnalyzeResponse(
        verdict=verdict,
        score=score,
        costar=costar,
        highlights=highlights,
        suggested_rewrite=suggested_rewrite,
        reasons=reasons
    )

@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    # Run analysis first
    analyze_req = AnalyzeRequest(prompt=req.prompt, persona=req.persona)
    analysis = analyze(analyze_req)

    # If blocked, return analysis only
    if analysis.verdict == "BLOCK":
        return ChatResponse(allowed=False, analysis=analysis, llm_response=None)

    if analysis.verdict == "NEEDS_FIX":
        # Optionally auto-rewrite and return rewrite with allowed=False
        return ChatResponse(allowed=False, analysis=analysis, llm_response=None)

    # ALLOW: forward to LLM (Gemini or stub) with original prompt for better context matching
    llm_resp = call_gemini_generate(req.prompt, max_tokens=800)
    return ChatResponse(allowed=True, analysis=analysis, llm_response=llm_resp)

# --- Simple health endpoint ---
@app.get("/health")
def health():
    return {"status":"ok", "use_stub": USE_STUB, "gemini_configured": bool(GEMINI_API_KEY)}

@app.get("/")
async def root():
    return {"message": "Prompt Review Engine API is running", "endpoints": ["/api/analyze", "/api/chat", "/health"]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)