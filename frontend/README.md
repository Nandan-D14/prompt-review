# Prompt Review Engine - React Frontend

A premium MacOS-inspired web dashboard for the Prompt Review Engine application, built with React, TypeScript, and Tailwind CSS.

## Features

### 🎨 Premium Design
- **MacOS-inspired UI**: Glassmorphism, soft shadows, rounded corners, and elegant typography
- **Dark/Light Mode**: Seamless theme switching with smooth transitions
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Smooth Animations**: Framer Motion powered interactions

### 🎯 Core Functionality
- **Persona System**: Three distinct AI personas (Professor, Guardian, Shield)
- **Real-time Analysis**: Instant prompt safety and quality assessment
- **COSTAR Framework**: Context, Objective, Style, Tone, Audience, Response breakdown
- **One-Click Rewrite**: Automatic prompt sanitization and improvement
- **History Tracking**: Complete log of analyzed prompts with timestamps

### 🛠️ Technical Stack
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **TanStack Query** for data fetching
- **Vite** for fast development and building

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API running on http://localhost:8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.tsx     # Navigation sidebar with personas
│   ├── Header.tsx      # Top navigation bar
│   ├── ChatArea.tsx    # Main chat interface
│   └── AnalysisPanel.tsx # Results and analysis display
├── contexts/           # React contexts
│   └── ThemeContext.tsx # Dark/light mode management
├── services/           # API and external services
│   └── api.ts         # Backend API integration
├── lib/               # Utility functions
│   └── utils.ts       # Helper functions
└── styles/            # Global styles and themes
    └── globals.css    # Tailwind CSS configuration
```

## API Integration

The frontend connects to the backend API at `http://localhost:8000` with the following endpoints:

- `POST /api/analyze` - Analyze a prompt
- `GET /health` - Health check endpoint

## Features Overview

### Personas
- **🎓 Prompt Professor**: Educational approach to prompt improvement
- **🏢 Brand Guardian**: Protects brand voice and tone consistency
- **🛡️ Prompt Shield**: Advanced security and safety focus

### Analysis Results
- **Verdict**: ALLOW / NEEDS_FIX / BLOCK with traffic-light colors
- **Health Score**: 0-100 safety rating with star visualization
- **COSTAR Breakdown**: Six-element prompt structure analysis
- **Safety Log**: Detailed explanation of detected issues
- **Suggested Rewrite**: One-click prompt improvement

### UI Features
- **Collapsible Sidebar**: Space-saving navigation
- **Voice Input**: Microphone button for speech-to-text
- **File Upload**: Support for .txt file analysis
- **Export Reports**: Download analysis results
- **Real-time Feedback**: Instant analysis updates

## Customization

### Adding New Personas
Edit `src/components/Sidebar.tsx` to add new personas:

```typescript
const personas = [
  { id: 'new-persona', name: 'New Persona', icon: '🎯', description: 'Description here' },
  // ... existing personas
];
```

### Styling
The design uses CSS custom properties for easy theming. Modify `src/index.css` to customize:
- Colors and gradients
- Border radius values
- Animation timings
- Glassmorphism effects

## Deployment

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready to be served by any static file server.

### Docker Deployment
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
