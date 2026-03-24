
# 🤖 Research Assistant AI Agent

[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5-green)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

<div align="center">
  <img src="public/demo-screenshot.png" alt="Research Assistant AI Demo" width="600"/>
  <p><em>Intelligent document Q&A with RAG architecture</em></p>
</div>

## 📋 Overview

A **production-ready AI research assistant** that demonstrates modern full-stack development with Retrieval Augmented Generation (RAG). Upload documents and ask intelligent questions about their content - the AI analyzes your documents and provides accurate, sourced answers.

### ✨ Key Features

- **📄 Document Upload**: Upload text files, PDFs, and documents with automatic text extraction
- **💬 Intelligent Q&A**: Ask natural language questions about your uploaded content
- **🧠 RAG Architecture**: Retrieval Augmented Generation for accurate, sourced answers
- **⚡ Real-time UI**: Smooth animations with typewriter effect responses
- **🔧 Built-in Debugging**: System diagnostics and health monitoring
- **📱 Responsive Design**: Works flawlessly on desktop, tablet, and mobile

### 🏗️ Architecture
┌─────────────────────────────────────────────────────────────────┐
│ Browser (Client) │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Next.js 14 App Router (React) │ │
│ │ • Beautiful UI with animations │ │
│ │ • Real-time chat with typewriter effect │ │
│ │ • File upload with progress │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────┐
│ API Layer (Server-side) │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ /api/upload → Extract text & store in memory │ │
│ │ /api/chat → RAG-powered Q&A with OpenAI │ │
│ │ /api/debug → System diagnostics & monitoring │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
│
┌────────────┴────────────┐
▼ ▼
┌─────────────────────┐ ┌─────────────────────┐
│ Memory Store │ │ OpenAI API │
│ • Shared document │ │ • GPT-3.5/4 │
│ storage across │ │ • Context-aware │
│ API routes │ │ responses │
└─────────────────────┘ └─────────────────────┘

text

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/research-assistant-ai.git
cd research-assistant-ai
Install dependencies
bash
npm install
# or
yarn install
Set up environment variables
bash
cp .env.example .env.local
# Add your OpenAI API key to .env.local
Start the development server
bash
npm run dev
# or
yarn dev
Open your browser
text
http://localhost:3000
🎯 Usage Guide

1. Upload a Document

Click the "Upload Docs" button
Select a text file (.txt) or PDF
Wait for confirmation and preview
2. Ask Questions

Type natural language questions like:

"What documents do I have?"
"What does my cover letter say about my experience?"
"Summarize the content I uploaded"
"Tell me about machine learning from my documents"
3. Debug Mode

Click the 🔧 button to see:

Document count and details
Environment status
System health metrics
Token usage estimates
🛠️ Tech Stack

Frontend

Next.js 14 - React framework with App Router
TypeScript - Type safety and better developer experience
Tailwind CSS - Utility-first styling with custom gradients
React Hooks - State management and side effects
Backend

Next.js API Routes - Serverless functions
OpenAI API - GPT-3.5 for intelligent responses
Memory Store - Shared document storage across API routes
PDF Parsing - Extract text from PDF documents
AI/ML

GPT-3.5 Turbo - Language model for responses
RAG Architecture - Document-aware question answering
Context Injection - Dynamic prompt engineering
Token Management - Smart truncation for large documents
📁 Project Structure

text
research-assistant-ai/
├── app/
│   ├── api/
│   │   ├── upload/         # File upload & text extraction
│   │   │   └── route.ts
│   │   ├── chat/           # AI chat with RAG
│   │   │   └── route.ts
│   │   └── debug/          # System diagnostics
│   │       └── route.ts
│   ├── lib/
│   │   ├── store.ts        # Shared memory store
│   │   └── processor.ts    # PDF/text processing
│   └── page.tsx            # Main UI component
├── public/                  # Static assets
├── .env.local               # Environment variables
├── package.json
└── README.md
🔧 API Reference

Upload Document

http
POST /api/upload
Content-Type: multipart/form-data

# Request
file: [your-file]

# Response
{
  "success": true,
  "filename": "example.txt",
  "message": "Document processed successfully",
  "preview": "File content preview...",
  "documentId": "1234567890",
  "readable": true
}
Chat with AI

http
POST /api/chat
Content-Type: application/json

# Request
{
  "message": "What does my cover letter say about my experience?"
}

# Response
{
  "response": "Based on your cover letter, you have 5 years of experience...",
  "contextFound": true,
  "documentCount": 1
}
System Diagnostics

http
GET /api/debug

# Response
{
  "status": "ok",
  "documentCount": 2,
  "documents": [...],
  "env": {
    "hasOpenAI": true,
    "hasSupabaseUrl": false,
    "nodeEnv": "development"
  }
}
🧪 Testing

Using curl

bash
# Upload a text file
echo "AI is transforming software development." > test.txt
curl -X POST http://localhost:3000/api/upload -F "file=@test.txt"

# Ask a question
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What does my document say about AI?"}'

# Check uploaded documents
curl http://localhost:3000/api/upload

# Debug system
curl http://localhost:3000/api/debug
Manual Testing Flow

Upload a text file with known content
Ask specific questions about that content
Verify answers match your document
Check debug panel for system status
Test with multiple documents
🚦 Performance Optimizations

Token Management: Smart truncation for large documents
Shared Memory: Documents persist across requests
Typewriter Effect: Progressive rendering for better UX
Error Handling: Graceful degradation with fallbacks
Loading States: Clear feedback during processing
🔒 Security Considerations

File Validation: Size limits and type checking
Content Sanitization: Safe text extraction
Environment Variables: API keys kept secure
No Database: In-memory storage (resets on server restart)
🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author

Your Name

LinkedIn: Your Profile
GitHub: @yourusername
Portfolio: yourportfolio.com
🙏 Acknowledgments

OpenAI for their incredible API
Vercel for Next.js and hosting
The open-source community
📧 Contact

Have questions or want to collaborate?

Email: usmanqidwai21@gmail.com

🎯 Why This Project Matters

This project demonstrates:

✅ Full-stack development with modern tools
✅ AI integration in production applications
✅ RAG architecture implementation
✅ Clean code practices
✅ Problem-solving abilities
✅ User experience design

Perfect for showcasing to potential employers!

<div align="center"> <strong>Built with ❤️ for AI enthusiasts and developers</strong> </div> ```