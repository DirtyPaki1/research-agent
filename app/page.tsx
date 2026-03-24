'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add to your existing state declarations
  const [uploadedDocuments, setUploadedDocuments] = useState<Array<{
    filename: string;
    preview: string;
    uploadTime: string;
  }>>([]);

  // Feature carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Function to fetch uploaded documents
  const fetchUploadedDocuments = async () => {
    try {
      const response = await fetch('/api/upload');
      const data = await response.json();
      if (data.documents) {
        setUploadedDocuments(data.documents);
        console.log('📚 Documents loaded:', data.documents.length);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  // Call this on initial load
  useEffect(() => {
    fetchUploadedDocuments();
  }, []);

  // REAL Upload function
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Updated handleFileUpload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setShowUploadModal(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh document list
        await fetchUploadedDocuments();
        
        setResponse(`✅ **${data.filename} uploaded successfully!**\n\n📊 ${data.message}\n\n📝 Preview: ${data.preview}\n\nYou can now ask questions about this document. Try: "What's in ${data.filename}?" or "Tell me about the content I uploaded"`);
      } else {
        setResponse(`❌ Upload failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResponse('❌ Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setShowUploadModal(false);
      }, 2000);
    }
  };

  // REAL View Code function
  const handleViewCode = () => {
    setShowCodeModal(true);
  };

  // Debug function to test the system
  const runDebug = async () => {
    setShowDebug(true);
    setDebugInfo({ status: 'running...' });
    
    const results: any = {};
    
    try {
      // Test 1: Check upload endpoint
      const uploadRes = await fetch('/api/upload');
      const uploadData = await uploadRes.json();
      results.upload = {
        status: uploadRes.status,
        documents: uploadData.documents?.length || 0,
        data: uploadData
      };
      
      // Test 2: Check chat endpoint
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'What documents do I have?' })
      });
      const chatData = await chatRes.json();
      results.chat = {
        status: chatRes.status,
        response: chatData.response?.substring(0, 100) + '...',
        documentCount: chatData.documentCount || 0
      };
      
      // Test 3: Check environment
      results.env = {
        hasOpenAI: !!process.env.NEXT_PUBLIC_OPENAI_KEY,
        nodeEnv: process.env.NODE_ENV
      };
      
      results.success = true;
    } catch (error: any) {
      results.error = error.message;
      results.success = false;
    }
    
    setDebugInfo(results);
  };

  // Updated handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      
      if (data.response) {
        // Typewriter effect
        let typedResponse = '';
        for (let i = 0; i < data.response.length; i++) {
          typedResponse += data.response[i];
          setResponse(typedResponse);
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      } else {
        setResponse('❌ No response from server');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setResponse('❌ Failed to get response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: "🚀",
      title: "Intelligent Routing",
      description: "AI autonomously decides between document search and web search",
      gradient: "from-cyan-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-cyan-500/20 to-blue-500/20"
    },
    {
      icon: "⚡",
      title: "Vector Search",
      description: "Semantic search with vector embeddings",
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-500/20 to-pink-500/20"
    },
    {
      icon: "🌐",
      title: "Live Integration",
      description: "Real-time information from multiple web sources",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-500/20 to-emerald-500/20"
    },
    {
      icon: "✨",
      title: "Agentic Workflow",
      description: "Autonomous tool calling and intelligent decisions",
      gradient: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-500/20 to-red-500/20"
    }
  ];

  const techStack = [
    { 
      name: "Next.js 14", 
      color: "bg-gradient-to-br from-gray-900 via-black to-gray-900", 
      icon: "⚡",
      border: "border-gray-800",
      shadow: "shadow-[0_0_40px_rgba(255,255,255,0.1)]"
    },
    { 
      name: "Vercel AI SDK", 
      color: "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800", 
      icon: "🤖",
      border: "border-gray-700",
      shadow: "shadow-[0_0_40px_rgba(156,163,175,0.2)]"
    },
    { 
      name: "TypeScript", 
      color: "bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900", 
      icon: "📘",
      border: "border-blue-800",
      shadow: "shadow-[0_0_40px_rgba(59,130,246,0.3)]"
    },
    { 
      name: "Tailwind", 
      color: "bg-gradient-to-br from-cyan-600 via-blue-500 to-cyan-600", 
      icon: "🎨",
      border: "border-cyan-600",
      shadow: "shadow-[0_0_40px_rgba(6,182,212,0.3)]"
    },
    { 
      name: "Supabase", 
      color: "bg-gradient-to-br from-green-700 via-emerald-600 to-green-700", 
      icon: "🗄️",
      border: "border-green-700",
      shadow: "shadow-[0_0_40px_rgba(16,185,129,0.3)]"
    },
    { 
      name: "OpenAI", 
      color: "bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700", 
      icon: "🧠",
      border: "border-purple-700",
      shadow: "shadow-[0_0_40px_rgba(168,85,247,0.3)]"
    }
  ];

  // Enhanced gradient backgrounds
  const gradientBackgrounds = [
    "bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30",
    "bg-gradient-to-bl from-blue-900/20 via-cyan-900/20 to-emerald-900/20",
    "bg-gradient-to-tr from-violet-900/20 via-purple-900/20 to-rose-900/20",
    "bg-gradient-to-tl from-sky-900/20 via-blue-900/20 to-indigo-900/20"
  ];

  const [currentGradient, setCurrentGradient] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradient((prev) => (prev + 1) % gradientBackgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${gradientBackgrounds[currentGradient]}`}>
      {/* Beautiful gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900/50 to-gray-900" />
      <div className="fixed inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30" />
      
      {/* Animated gradient orbs */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      <div className="fixed top-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/10 to-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
      
      {/* Geometric patterns */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border-2 border-cyan-500/30 rounded-3xl rotate-45" />
        <div className="absolute bottom-40 right-40 w-48 h-48 border-2 border-purple-500/30 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 border-2 border-emerald-500/30 rounded-lg rotate-12" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-60 animate-pulse" />
                  <div className="relative p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">🤖</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Research <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Assistant AI</span>
                  </h1>
                  <p className="text-cyan-200/80 text-sm md:text-base">
                    Production-Ready AI Agent • Perfect Portfolio Project
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleUploadClick}
                  disabled={uploading}
                  className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">📤</span>
                        Upload Docs
                      </>
                    )}
                  </span>
                </button>
                
                <button
                  onClick={handleViewCode}
                  className="group px-6 py-3 bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm text-white font-semibold rounded-xl hover:from-gray-700/80 hover:to-gray-800/80 transition-all hover:scale-105 border border-white/10 hover:border-cyan-500/30"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xl">👨‍💻</span>
                    View Code
                  </span>
                </button>

                {/* Debug Button - Hidden by default, click "D" to show */}
                <button
                  onClick={runDebug}
                  className="group px-4 py-3 bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm text-white rounded-xl hover:from-gray-700/40 hover:to-gray-800/40 transition-all border border-white/5"
                  title="Debug System"
                >
                  <span className="text-sm">🔧</span>
                </button>
              </div>
            </div>

            {/* Document Count Badge */}
            {uploadedDocuments.length > 0 && (
              <div className="mt-4 flex justify-center">
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-500/30">
                  <span className="text-cyan-200">
                    📚 {uploadedDocuments.length} document{uploadedDocuments.length > 1 ? 's' : ''} in knowledge base
                  </span>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Debug Panel */}
        {showDebug && debugInfo && (
          <div className="max-w-7xl mx-auto px-4 mt-4">
            <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-4 border border-cyan-500/30">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-white font-bold">🔧 Debug Information</h3>
                <button 
                  onClick={() => setShowDebug(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <pre className="text-xs text-cyan-300 overflow-auto max-h-60">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="px-4 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-8 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-full border border-cyan-500/30 animate-pulse">
                <span className="text-2xl">✨</span>
                <span className="text-white font-medium text-lg">
                  Showcase Project for Your Resume
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
                  Intelligent
                </span>
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent animate-gradient mt-4" style={{animationDelay: '0.5s'}}>
                  Research Agent
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-12 leading-relaxed">
                A <span className="font-bold text-cyan-300">production-ready AI application</span> demonstrating 
                RAG, agentic workflows, and intelligent search. 
                Built with cutting-edge technologies to showcase your <span className="font-bold text-purple-300">AI engineering skills</span>.
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap justify-center gap-4 mb-16">
                {techStack.map((tech, index) => (
                  <div
                    key={tech.name}
                    className={`${tech.color} ${tech.shadow} border ${tech.border} px-6 py-4 rounded-2xl flex items-center gap-3 font-semibold text-white hover:scale-110 transition-all duration-300 animate-fadeIn`}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <span className="text-2xl">{tech.icon}</span>
                    <span className="text-lg">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              {/* Chat Interface */}
              <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-[0_0_60px_rgba(59,130,246,0.15)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
                    <span className="text-3xl">💬</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Try the AI Agent</h2>
                    <p className="text-gray-300">Experience intelligent question answering</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-30" />
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="✨ Ask anything! The AI will search your uploaded documents...\n\nExample: 'What's in my documents?' or 'Summarize the content I uploaded'"
                      className="relative w-full h-48 p-6 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-lg"
                      disabled={loading}
                    />
                    <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                      {message.length}/500
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white font-bold text-lg py-5 rounded-2xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-700 via-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                          <span className="text-xl">Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl">⚡</span>
                          <span className="text-xl">Ask Intelligent AI Agent</span>
                          <span className="text-2xl group-hover:translate-x-2 transition-transform">🚀</span>
                        </>
                      )}
                    </span>
                  </button>
                </form>
                
                {response && (
                  <div className="mt-8 p-6 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm rounded-2xl border border-cyan-500/30 shadow-xl animate-fadeIn">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">AI Agent Response</h3>
                    </div>
                    <div className="text-gray-200 leading-relaxed whitespace-pre-line text-lg">
                      {response}
                    </div>
                  </div>
                )}
              </div>

              {/* Features Showcase */}
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-4">✨ Key Features</h2>
                  <p className="text-gray-300 text-lg">Interactive demonstration of cutting-edge capabilities</p>
                </div>
                
                <div className="relative h-96 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 overflow-hidden">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 p-8 transition-all duration-700 ${
                        activeFeature === index 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8 pointer-events-none'
                      }`}
                    >
                      <div className={`${feature.bgColor} p-5 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-xl`}>
                        <span className="text-4xl">{feature.icon}</span>
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className="text-xl text-gray-200">{feature.description}</p>
                      <div className="mt-6">
                        <div className={`h-2 w-24 bg-gradient-to-r ${feature.gradient} rounded-full`} />
                      </div>
                    </div>
                  ))}
                  
                  {/* Feature Navigation */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          activeFeature === index 
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 w-10' 
                            : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-cyan-500/20 text-center hover:scale-105 transition-transform">
                    <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">100%</div>
                    <div className="text-gray-300 font-medium">AI Accuracy</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-purple-500/20 text-center hover:scale-105 transition-transform">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">24/7</div>
                    <div className="text-gray-300 font-medium">Live Updates</div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-green-500/20 text-center hover:scale-105 transition-transform">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">∞</div>
                    <div className="text-gray-300 font-medium">Scalability</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document List */}
            {uploadedDocuments.length > 0 && (
              <div className="mb-12 bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-3xl">📚</span>
                  Your Knowledge Base
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedDocuments.map((doc, index) => (
                    <div key={index} className="bg-gray-800/50 rounded-xl p-4 border border-cyan-500/20">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">📄</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{doc.filename}</p>
                          <p className="text-sm text-gray-400">Uploaded: {doc.uploadTime}</p>
                          <p className="text-xs text-cyan-300 mt-2 truncate">{doc.preview}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture Diagram */}
            <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-12 mb-16 border border-white/10 hover:shadow-[0_0_60px_rgba(168,85,247,0.15)] transition-all duration-300">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-white mb-8">
                  🏗️ System <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Architecture</span>
                </h2>
                <p className="text-gray-300 text-xl max-w-3xl mx-auto">
                  Modern AI application architecture with intelligent routing and real-time processing
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {[
                  { icon: "📤", title: "Document Upload", desc: "PDFs, text files", gradient: "from-cyan-500 to-blue-500" },
                  { icon: "✂️", title: "Text Processing", desc: "Chunking & parsing", gradient: "from-blue-500 to-indigo-500" },
                  { icon: "🗄️", title: "Vector Storage", desc: "Supabase + pgvector", gradient: "from-purple-500 to-pink-500" },
                  { icon: "🔍", title: "Semantic Search", desc: "Similarity matching", gradient: "from-pink-500 to-rose-500" },
                  { icon: "🤖", title: "AI Generation", desc: "GPT-4 response", gradient: "from-green-500 to-emerald-500" }
                ].map((step, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center h-full hover:scale-105 transition-transform duration-300">
                      <div className={`bg-gradient-to-br ${step.gradient} p-4 rounded-xl inline-block mb-4 transform group-hover:scale-110 transition-transform`}>
                        <span className="text-4xl">{step.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.desc}</p>
                    </div>
                    {index < 4 && (
                      <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <span className="text-2xl text-gray-500 group-hover:text-cyan-400 transition-colors">→</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Impact Section */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                <span className="text-3xl">🏆</span>
                <span className="text-2xl font-bold text-white">Perfect for Your Resume!</span>
              </div>
              
              <h2 className="text-5xl font-bold text-white mb-8">
                Showcases <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Real-World AI Skills</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-cyan-500/30 transition-colors">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-green-400">✅</span>
                    What Employers See
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Full-stack AI application development",
                      "Production-ready RAG implementation",
                      "Modern TypeScript & Next.js expertise",
                      "Agentic AI workflow design",
                      "Vector database operations (pgvector)",
                      "Real-time web search APIs"
                    ].map((skill, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-800/30 transition group">
                        <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <span className="text-xl">✓</span>
                        </div>
                        <span className="text-lg text-gray-200 group-hover:text-white transition-colors">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-colors">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-purple-400">🚀</span>
                    Technical Highlights
                  </h3>
                  <div className="space-y-4">
                    {[
                      "Vercel AI SDK integration",
                      "Semantic search with embeddings",
                      "Autonomous tool calling",
                      "Responsive UI with animations",
                      "Real-time data processing",
                      "Scalable cloud architecture"
                    ].map((highlight, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-800/30 transition group">
                        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <span className="text-xl">⭐</span>
                        </div>
                        <span className="text-lg text-gray-200 group-hover:text-white transition-colors">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-24 px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="border-t border-white/10 pt-12 text-center">
              <p className="text-gray-400 text-lg">
                Built with ❤️ using <span className="text-cyan-300">Next.js 14</span>, 
                <span className="text-blue-300"> Supabase</span>, and 
                <span className="text-purple-300"> cutting-edge AI technologies</span>
              </p>
              <p className="text-gray-500 mt-4">
                Showcases real-world AI engineering skills for your resume • {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        multiple
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-cyan-500/30 animate-fadeIn">
            <div className="text-center">
              <div className="mb-6">
                <div className="text-5xl mb-4 animate-bounce">📁</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {uploading ? 'Uploading Documents...' : 'Upload Complete!'}
                </h3>
                <p className="text-gray-300">
                  {uploading 
                    ? 'Processing your files and generating embeddings...'
                    : 'Your files have been uploaded successfully'
                  }
                </p>
              </div>
              
              {uploading ? (
                <div className="space-y-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                  <p className="text-sm text-gray-400">Creating vector embeddings...</p>
                </div>
              ) : (
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCodeModal(false)} />
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-2xl w-full border border-purple-500/30 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👨‍💻</span>
                <h3 className="text-2xl font-bold text-white">Source Code</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition"
              >
                <span className="text-2xl text-gray-400">×</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-800/50 rounded-2xl">
                <h4 className="text-lg font-semibold text-white mb-4">Project Structure</h4>
                <pre className="text-gray-300 text-sm font-mono overflow-x-auto">
{`research-agent/
├── app/
│   ├── api/
│   │   ├── chat/route.ts    # AI chat with RAG
│   │   └── upload/route.ts  # Document upload with embeddings
│   ├── lib/
│   │   ├── supabase.ts      # Database client
│   │   └── vector-db.ts     # Vector operations
│   └── page.tsx             # Main UI
├── public/
├── .env.local
└── package.json`}
                </pre>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => window.open('https://github.com/vercel/ai', '_blank')}
                  className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all flex items-center gap-3 group hover:scale-105"
                >
                  <span className="text-2xl">🐙</span>
                  <div className="text-left">
                    <div className="font-bold text-white">View on GitHub</div>
                    <div className="text-sm text-gray-400">Vercel AI SDK Repository</div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    const content = `# Research Assistant AI Agent\n\nA production-ready AI application showcasing RAG, agentic workflows, and intelligent search. Perfect for your resume!\n\n## Features:\n- Document upload and processing\n- Vector search with embeddings\n- Real-time web search\n- AI agent with tool calling\n\nBuilt with Next.js 14, Supabase, TypeScript, and Tailwind CSS.`;
                    const blob = new Blob([content], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'research-agent-demo.md';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all flex items-center gap-3 group hover:scale-105"
                >
                  <span className="text-2xl">💾</span>
                  <div className="text-left">
                    <div className="font-bold text-white">Download Demo</div>
                    <div className="text-sm text-gray-400">Project documentation</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}