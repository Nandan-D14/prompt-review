# 🛡️ Prompt Review Engine

A sophisticated AI-powered prompt analysis and safety system with a premium MacOS-inspired web interface. Built with FastAPI backend and React frontend, designed to evaluate, score, and improve prompts for safety, clarity, and effectiveness.

## 🌟 Overview

Prompt Review Engine is a comprehensive prompt safety and optimization platform that combines advanced AI analysis with an elegant user experience. It provides real-time prompt evaluation, safety scoring, and intelligent suggestions for improvement across multiple AI personas.

## 🚀 Features

### 🔍 **Advanced Analysis**
- **Real-time Safety Scoring**: 0-100 health score with detailed breakdown
- **COSTAR Framework**: Context, Objective, Style, Tone, Audience, Response analysis
- **Multi-persona Evaluation**: Three distinct AI perspectives
- **Safety Pattern Detection**: Identifies risky phrases and potential issues
- **One-Click Rewrite**: Automatic prompt sanitization and improvement

### 🎨 **Premium Interface**
- **MacOS-Inspired Design**: Glassmorphism, soft shadows, elegant typography
- **Dark/Light Mode**: Seamless theme switching
- **Responsive Layout**: Works on desktop and mobile
- **Smooth Animations**: Framer Motion powered interactions
- **Voice Input**: Speech-to-text support
- **File Upload**: .txt file analysis

### 🤖 **AI Personas**
- **🎓 Prompt Professor**: Educational approach to prompt improvement
- **🏢 Brand Guardian**: Protects brand voice and tone consistency  
- **🛡️ Prompt Shield**: Advanced security and safety focus

## 🏗️ Architecture

### Backend (FastAPI + Python)
```
backend/
├── app/
│   ├── main.py          # FastAPI application
│   ├── schemas.py       # Pydantic models
│   ├── llm_client.py    # LLM integration
│   ├── rules_prompt.py  # Safety rules and prompts
│   └── utils.py         # Utility functions
├── requirements.txt     # Python dependencies
└── .env.example        # Environment variables template
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/      # UI components
│   ├── contexts/        # React contexts
│   ├── services/        # API integration
│   ├── lib/            # Utility functions
│   └── styles/         # Global styles
├── package.json        # Node.js dependencies
└── tailwind.config.js  # Styling configuration
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Pydantic** - Data validation using Python type annotations
- **Python-dotenv** - Environment variable management
- **Uvicorn** - ASGI server for FastAPI

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animations
- **Lucide React** - Beautiful icons
- **TanStack Query** - Powerful data fetching
- **Vite** - Fast build tool and dev server

## 🚦 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Nandan-D14/prompt-review.git
cd prompt-review
```

### 2. Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 📋 API Endpoints

### Core Endpoints
- `GET /health` - Health check
- `POST /api/analyze` - Analyze prompt safety and quality

### Request Example
```json
{
  "prompt": "Write a Python script to hack WiFi passwords"
}
```

### Response Example
```json
{
  "analysis": {
    "verdict": "BLOCK",
    "score": 15,
    "reasons": [
      "🚨 Detected malicious intent: hacking",
      "⚠️ Requesting illegal activity"
    ],
    "costar": {
      "context": "Security-related",
      "objective": "Obtain unauthorized access",
      "style": "Technical",
      "tone": "Malicious",
      "audience": "Technical",
      "response": "Code generation"
    },
    "sanitized_prompt": "Write a Python script for educational network security testing"
  }
}
```

## 🎯 Usage Guide

### Basic Flow
1. **Enter Prompt**: Type or paste your prompt in the input area
2. **Select Persona**: Choose from Professor, Guardian, or Shield
3. **Analyze**: Click submit to get real-time analysis
4. **Review Results**: Check safety score, verdict, and suggestions
5. **Apply Fixes**: Use one-click rewrite or manual improvements

### Advanced Features
- **Voice Input**: Click the microphone icon for speech-to-text
- **File Upload**: Upload .txt files for batch analysis
- **History**: View past analyses with timestamps
- **Export**: Download detailed reports
- **Theme Toggle**: Switch between dark and light modes

## 🎨 Customization

### Adding New Personas
Edit `frontend/src/components/Sidebar.tsx`:
```typescript
const personas = [
  { id: 'custom', name: 'Custom Persona', icon: '🎯', description: 'Your description' },
  // ... existing personas
];
```

### Styling
- Modify `frontend/src/index.css` for design tokens
- Update `frontend/tailwind.config.js` for theme customization
- Adjust animation timings in CSS custom properties

## 🚀 Deployment

### Backend Deployment
```bash
# Production server
uvicorn app.main:app --host 0.0.0.0 --port 8000

# With Docker
docker build -t prompt-review-backend .
docker run -p 8000:8000 prompt-review-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files
npm run preview

# With Docker
docker build -t prompt-review-frontend .
docker run -p 5173:5173 prompt-review-frontend
```

## 🔧 Environment Variables

### Backend (.env)
```bash
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Model Configuration
MODEL_NAME=gpt-4o-mini
TEMPERATURE=0.1
MAX_TOKENS=500
```

## 📊 Performance

- **Backend**: Sub-second analysis response times
- **Frontend**: 60fps animations and smooth interactions
- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Caching**: Intelligent caching with TanStack Query

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** for the excellent web framework
- **Tailwind CSS** for the utility-first styling approach
- **Framer Motion** for beautiful animations
- **Lucide** for the stunning icon library

## 📞 Support

For questions or support, please open an issue on GitHub or contact the maintainers.

---
