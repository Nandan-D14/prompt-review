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
  persona?: 'Professor' | 'Guardian' | 'Shield';
  options?: Record<string, any>;
}

export interface AnalyzeRequest {
  prompt: string;
  persona?: 'Professor' | 'Guardian' | 'Shield';
  options?: Record<string, any>;
}

export interface ChatRequest {
  prompt: string;
  persona?: 'Professor' | 'Guardian' | 'Shield';
  options?: Record<string, any>;
}

export interface Highlight {
  type: string;
  token?: string;
  reason?: string;
  match?: any;
}

export interface CostarData {
  Context: string;
  Objective: string;
  Style: string;
  Tone: string;
  Audience: string;
  Response: string;
}

export interface AnalyzeResponse {
  verdict: 'ALLOW' | 'NEEDS_FIX' | 'BLOCK';
  score: number;
  costar: CostarData;
  highlights: Highlight[];
  suggested_rewrite: string;
  reasons: string[];
}

export interface ChatResponse {
  allowed: boolean;
  analysis: AnalyzeResponse;
  llm_response?: string;
}

export interface HealthResponse {
  status: string;
  use_stub: boolean;
  gemini_configured: boolean;
}

export const promptApi = {
  analyze: async (request: AnalyzeRequest): Promise<AnalyzeResponse> => {
    const response = await api.post<AnalyzeResponse>('/api/analyze', request);
    return response.data;
  },
  
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat', request);
    return response.data;
  },
  
  healthCheck: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },
};
