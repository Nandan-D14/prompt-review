import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PromptRequest {
  prompt: string;
}

export interface Analysis {
  verdict: string;
  reasons: string[];
  costar: {
    context: string;
    objective: string;
    style: string;
    tone: string;
    audience: string;
    response: string;
  };
  sanitized_prompt: string;
}

export interface AnalyzeResponse {
  analysis: Analysis;
  llm_response?: string;
}

export const promptApi = {
  analyze: async (prompt: string): Promise<AnalyzeResponse> => {
    const response = await api.post<AnalyzeResponse>('/api/analyze', { prompt });
    return response.data;
  },
  
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};
