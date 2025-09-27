from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class PromptRequest(BaseModel):
    prompt: str

class Analysis(BaseModel):
    verdict: str
    reasons: List[str]
    costar: Dict[str, str]
    sanitized_prompt: str

class AnalyzeResponse(BaseModel):
    analysis: Analysis
    llm_response: Optional[str] = None