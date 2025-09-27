import os
import json
from typing import Any, Dict

import requests

from .utils import get_env
from .rules_prompt import RULE_ENGINE_SYSTEM_PROMPT

GEMINI_API_KEY = get_env("GEMINI_API_KEY")
GEMINI_API_URL = get_env(
    "GEMINI_API_URL",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
)


def _call_external_llm(payload: Dict[str, Any], is_rule_engine: bool = False) -> Dict[str, Any]:
    """
    Generic HTTP POST to Gemini API.
    Stub mode returns canned JSON if API key is missing.
    """
    if not GEMINI_API_KEY or "REPLACE" in (GEMINI_API_KEY or ""):
        # Stub mode for development
        if is_rule_engine:
            return {
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": json.dumps({
                                "verdict": "ALLOW",
                                "reasons": ["stubbed - no API key"],
                                "costar": {
                                    "Context": "Development testing",
                                    "Objective": "Verify system functionality",
                                    "Style": "Professional",
                                    "Tone": "Neutral",
                                    "Audience": "Developer",
                                    "Response": "Test response"
                                },
                                "sanitized_prompt": "Explain the concept of artificial intelligence."
                            })
                        }]
                    }
                }]
            }
        else:
            return {
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": "This is a stub response since no API key was provided."
                        }]
                    }
                }]
            }

    headers = {"Content-Type": "application/json"}
    
    # Gemini API uses key as query parameter
    url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"
    
    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        if is_rule_engine:
            # Return a safe fallback for rule engine
            return {
                "candidates": [{
                    "content": {
                        "parts": [{
                            "text": json.dumps({
                                "verdict": "NEEDS_FIX",
                                "reasons": [f"API call failed: {str(e)}"],
                                "costar": {},
                                "sanitized_prompt": ""
                            })
                        }]
                    }
                }]
            }
        raise e

def run_rule_check(user_prompt: str) -> Dict[str, Any]:
    """
    Send the rule-engine prompt to Gemini and parse JSON response.
    """
    combined_prompt = RULE_ENGINE_SYSTEM_PROMPT + "\n\nUser prompt:\n" + user_prompt

    payload = {
        "contents": [{
            "parts": [{"text": combined_prompt}]
        }],
        "generationConfig": {
            "temperature": 0.0,
            "maxOutputTokens": 512
        }
    }

    raw = _call_external_llm(payload, is_rule_engine=True)
    text = _extract_text_from_response(raw)

    try:
        # Find JSON in the response
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            json_text = text[start:end]
            parsed = json.loads(json_text)
        else:
            raise ValueError("No JSON found in response")
    except Exception as e:
        parsed = {
            "verdict": "NEEDS_FIX",
            "reasons": [f"Failed to parse LLM output: {str(e)}"],
            "costar": {},
            "sanitized_prompt": user_prompt
        }

    parsed["verdict"] = parsed.get("verdict", "NEEDS_FIX").upper()
    return parsed

def run_inference(sanitized_prompt: str) -> str:
    """
    Forward sanitized prompt to Gemini to get final answer.
    """
    payload = {
        "contents": [{
            "parts": [{"text": sanitized_prompt}]
        }],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 800
        }
    }

    raw = _call_external_llm(payload)
    return _extract_text_from_response(raw)

def _extract_text_from_response(raw: Dict[str, Any]) -> str:
    """
    Parse Gemini response to extract text.
    """
    try:
        # Standard Gemini response format
        if "candidates" in raw and raw["candidates"]:
            candidate = raw["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                parts = candidate["content"]["parts"]
                if parts and "text" in parts[0]:
                    return parts[0]["text"]
        
        # Fallback: return the whole response as string
        return json.dumps(raw)
    except Exception as e:
        return f"Error extracting text: {str(e)}"