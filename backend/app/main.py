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
COMMON_SLANG = {"oi", "bruh", "wtf", "wanna", "gonna", "sus", "lol", "yeet", "slay", "fire", "bet"}
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

app = FastAPI(title="Prompt Review Engine - Backend")

# Allow CORS from localhost/frontend (adjust for deploy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
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
            findings.append({"type":"slang","token":w,"reason":"common_slang"})
    # double-meaning heuristics: presence of "hack" + "how to" etc.
    if re.search(r"\bhack\b", text, re.I):
        findings.append({"type":"risky","token":"hack","reason":"potential illicit intent"})
    # ambiguous question like "is it ok to..." - low confidence marker
    if re.search(r"\bis it ok to\b", text, re.I):
        findings.append({"type":"ambiguous","token":"is it ok to","reason":"ambiguous intent"})
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

def decide_verdict(issues_count: int, injection_found: bool) -> str:
    if injection_found:
        return "BLOCK"
    if issues_count == 0:
        return "ALLOW"
    if issues_count <= 2:
        return "NEEDS_FIX"
    return "BLOCK"

def build_sanitized_rewrite(prompt: str, costar: dict, persona: str) -> str:
    # Use a short heuristic rewrite as fallback; ideally we call Gemini for polished rewrite.
    # Keep it concise and safe.
    base = prompt
    # simple replacements
    base = re.sub(r"\bhack\b", "discuss security risks around", base, flags=re.I)
    base = re.sub(r"\bpassword\b", "authentication methods", base, flags=re.I)
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
    # A tiny local stub to ensure demos never fail.
    return (
        "STUB LLM RESPONSE: This is a simulated LLM reply. "
        "In production, configure GEMINI_API_KEY and set USE_STUB=false to call Gemini."
    )

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
    verdict = decide_verdict(issues_count, injection_found)

    # Suggested rewrite (call Gemini if available, else simple fallback)
    suggested_rewrite = ""
    # Try to get a nicer rewrite from Gemini
    rewrite_prompt = (
        f"Rewrite the following user prompt to be safe, professional, and aligned with COSTAR.\n"
        f"Original prompt: '''{prompt}'''\n"
        f"COSTAR: {json.dumps(costar)}\n"
        f"Persona: {persona}\n"
        f"Provide only the sanitized prompt (one short paragraph)."
    )
    suggested_rewrite = call_gemini_generate(rewrite_prompt, max_tokens=256)

    # If gemini returned stub or empty, fallback
    if not suggested_rewrite or suggested_rewrite.startswith("STUB LLM RESPONSE"):
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

    # ALLOW: forward to LLM (Gemini or stub)
    llm_prompt = (
        f"You are an assistant. Respond to the following prompt in a concise, helpful manner.\n"
        f"Persona: {req.persona}\n\nUser prompt:\n{req.prompt}\n\n"
        f"Additionally include a short analysis summary explaining why the prompt was allowed (1-2 lines)."
    )
    llm_resp = call_gemini_generate(llm_prompt, max_tokens=800)
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