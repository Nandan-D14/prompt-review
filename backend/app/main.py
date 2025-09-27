from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .schemas import PromptRequest, AnalyzeResponse
from .llm_client import run_rule_check, run_inference

app = FastAPI(title="Prompt Review Engine", version="1.0.0")

# CORS middleware
app.add_middleware(
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Prompt Review Engine API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(req: PromptRequest):
    prompt = req.prompt.strip()
    if not prompt:
        raise HTTPException(status_code=400, detail="Empty prompt")

    try:
        analysis_result = run_rule_check(prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rule-check failed: {e}")

    llm_response = None
    if analysis_result.get("verdict", "").upper() == "ALLOW":
        try:
            sanitized = analysis_result.get("sanitized_prompt", prompt)
            llm_response = run_inference(sanitized)
        except Exception as e:
            llm_response = f"[LLM forwarding failed] {e}"

    return AnalyzeResponse(analysis=analysis_result, llm_response=llm_response)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)