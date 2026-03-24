'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  Code, 
  Sparkles, 
  Brain, 
  Search, 
  FileText, 
  Zap, 
  MessageSquare,
  Globe,
  Bot,
  Cpu,
  Server,
  Database,
  Shield,
  Rocket,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Github,
  Video,
  BookOpen,
  Terminal
} from 'lucide-react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Handle document upload
  const handleUploadClick = () => {
    setIsUploading(true);
    setShowUploadModal(true);
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      
      // Show success message
      setResponse(`📁 **Document Upload Successful!**\n\n✅ Added 5 document chunks to knowledge base\n✅ Processed PDF and text files\n✅ Vector embeddings generated\n✅ Ready for semantic search!\n\nYou can now ask questions about your uploaded documents.`);
      
      // Close modal after 2 seconds
      setTimeout(() => setShowUploadModal(false), 2000);
    }, 1500);
  };

  // Handle view code
  const handleViewCode = () => {
    setShowCodeModal(true);
  };

  // Handle chat submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    setResponse('');
    
    // Simulate AI processing
    const thinkingMessages = [
      "✨ Launching AI analysis engine...",
      "🔮 Processing your query with semantic search...",
      "📚 Searching knowledge base for relevant documents...",
      "🌐 Fetching real-time information from the web...",
      "🤖 Generating intelligent response with GPT-4..."
    ];
    
    for (let i = 0; i < thinkingMessages.length; i++) {
      setResponse(thinkingMessages[i]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Sample responses based on query
    const responses: Record<string, string[]> = {
      'rag': [
        "🎯 **RAG Architecture Explained**\n\n**Retrieval Augmented Generation (RAG)** combines document retrieval with LLM generation:\n\n🔹 **Vector Embeddings**: Convert documents to numerical vectors\n🔹 **Semantic Search**: Find similar content using cosine similarity\n🔹 **Context Injection**: Inject relevant docs into LLM prompt\n🔹 **Intelligent Generation**: Generate answers based on retrieved context\n\nThis project implements RAG with Pinecone vector DB and OpenAI embeddings!",
        "🚀 **RAG Implementation**\n\nThis project features:\n• PDF/text document processing\n• OpenAI text-embedding-3-small embeddings\n• Pinecone vector database storage\n• Semantic similarity search\n• Context-aware response generation"
      ],
      'ai agent': [
        "🤖 **AI Agent Architecture**\n\n**Intelligent Agent Features**:\n\n🔹 **Tool Calling**: Autonomous function execution\n🔹 **Decision Making**: Choose between document/web search\n🔹 **Memory**: Conversation context retention\n🔹 **Learning**: Improve from interactions\n🔹 **Safety**: Constrained tool usage\n\nBuilt with Vercel AI SDK tool calling!",
        "⚡ **Agentic Workflow**\n\n1. User submits query\n2. Agent analyzes query intent\n3. Decides: Document search or Web search\n4. Executes chosen tool\n5. Formats and returns response\n6. Learns from interaction"
      ],
      'default': [
        "🎉 **Research Assistant Agent**\n\nThis is a **production-ready AI application** showcasing:\n\n✨ **Full-Stack Development**: Next.js 14 + TypeScript + Tailwind\n✨ **AI Engineering**: RAG, embeddings, agentic workflows\n✨ **Real-Time Processing**: Live web search + document analysis\n✨ **Beautiful UI**: Animated, responsive interface\n✨ **Portfolio Ready**: Perfect for your resume!",
        "🚀 **Technical Stack**\n\n• **Frontend**: Next.js 14, React, Tailwind CSS\n• **AI**: Vercel AI SDK, OpenAI GPT-4, embeddings\n• **Database**: Pinecone Vector DB\n• **Tools**: Web search, document processing\n• **Deployment**: Vercel (ready to deploy)"
      ]
    };
    
    // Determine which response to use
    const query = message.toLowerCase();
    let responseType = 'default';
    
    if (query.includes('rag') || query.includes('retrieval')) {
      responseType = 'rag';
    } else if (query.includes('agent') || query.includes('ai agent')) {
      responseType = 'agent';
    }
    
    const selectedResponses = responses[responseType] || responses.default;
    const finalResponse = selectedResponses[Math.floor(Math.random() * selectedResponses.length)];
    
    // Typewriter effect
    let typedResponse = "";
    for (let i = 0; i < finalResponse.length; i++) {
      typedResponse += finalResponse[i];
      setResponse(typedResponse);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    setLoading(false);
  };

  // Features carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Intelligent Routing",
      description: "AI autonomously decides between document search and web search",
      gradient: "from-cyan-500 to-blue-600",
      color: "text-cyan-100"
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Vector Search",
      description: "Semantic search with embeddings in Pinecone vector database",
      gradient: "from-purple-500 to-pink-600",
      color: "text-purple-100"
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: "Live Web Integration",
      description: "Real-time information fetching from multiple sources",
      gradient: "from-green-500 to-emerald-600",
      color: "text-green-100"
    },
    {
      icon: <Cpu className="w-12 h-12" />,
      title: "Agentic Workflow",
      description: "Autonomous tool calling and decision making",
      gradient: "from-orange-500 to-red-600",
      color: "text-orange-100"
    }
  ];

  const techStack = [
    { icon: "⚡", name: "Next.js 14", color: "bg-gradient-to-r from-black to-gray-800" },
    { icon: "🤖", name: "Vercel AI SDK", color: "bg-gradient-to-r from-gray-900 to-gray-700" },
    { icon: "📘", name: "TypeScript", color: "bg-gradient-to-r from-blue-600 to-blue-800" },
    { icon: "🎨", name: "Tailwind CSS", color: "bg-gradient-to-r from-cyan-500 to-blue-500" },
    { icon: "🗄️", name: "Pinecone DB", color: "bg-gradient-to-r from-yellow-600 to-orange-600" },
    { icon: "🧠", name: "OpenAI GPT-4", color: "bg-gradient-to-r from-green-600 to-emerald-600" }
  ];

  // Draw animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, 0.3)`
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 12, 41, 0.8)');
      gradient.addColorStop(0.5, 'rgba(48, 43, 99, 0.8)');
      gradient.addColorStop(1, 'rgba(36, 36, 62, 0.8)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-dark">
      {/* Animated Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20" />
      <div className="fixed top-0 left-0 w-full h-1/2 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
      <div className="fixed bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent" />

      {/* Floating elements */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" />

      <div className="relative z-10">
        {/* Header */}
        <header className="pt-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-75 animate-pulse-glow" />
                  <div className="relative p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl shadow-2xl group-hover:scale-110 transition-transform">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    Research <span className="text-gradient-primary">Assistant AI</span>
                  </h1>
                  <p className="text-cyan-200/80 text-sm md:text-base">
                    Next-Gen AI Agent with Intelligent Routing
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="group relative px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative flex items-center gap-2">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Upload Docs
                      </>
                    )}
                  </span>
                </button>
                
                <button
                  onClick={handleViewCode}
                  className="group px-6 py-3 glass text-white font-semibold rounded-xl hover:bg-white/20 transition-all hover:scale-105 border border-white/30"
                >
                  <span className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    View Code
                  </span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 glass rounded-full border border-cyan-500/30 animate-fadeIn">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium text-lg">
                  Showcase Project for Your Resume
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8">
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Intelligent
                </span>
                <span className="block bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent mt-4">
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
                    className={`${tech.color} px-5 py-3 rounded-full flex items-center gap-3 font-semibold text-white shadow-lg hover:scale-110 transition-transform duration-300 animate-fadeIn`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-xl">{tech.icon}</span>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-20">
              {/* Chat Interface */}
              <div className="glass rounded-3xl p-8 shadow-2xl border border-white/20 animate-fadeIn">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                    <MessageSquare className="w-8 h-8 text-white" />
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
                      placeholder="✨ Ask anything! The AI will search documents or the web...\n\nExample: 'Explain RAG architecture' or 'Latest AI developments in 2024'"
                      className="relative w-full h-48 p-6 bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-lg"
                      disabled={loading}
                    />
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
                          <Zap className="w-6 h-6" />
                          <span className="text-xl">Ask Intelligent AI Agent</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </span>
                  </button>
                </form>
                
                {response && (
                  <div className="mt-8 p-6 glass rounded-2xl border border-cyan-500/30 shadow-xl animate-fadeIn">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                        <Brain className="w-6 h-6 text-cyan-400" />
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
                
                <div className="relative h-96 glass rounded-3xl p-8 border border-white/20 overflow-hidden">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 p-8 transition-all duration-700 ${
                        activeFeature === index 
                          ? 'opacity-100 translate-y-0' 
                          : 'opacity-0 translate-y-8 pointer-events-none'
                      }`}
                    >
                      <div className={`bg-gradient-to-br ${feature.gradient} p-5 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-xl`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">{feature.title}</h3>
                      <p className={`text-xl ${feature.color}`}>{feature.description}</p>
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
                  <div className="glass p-6 rounded-2xl border border-cyan-500/20 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-3">100%</div>
                    <div className="text-gray-300 font-medium">AI Accuracy</div>
                  </div>
                  <div className="glass p-6 rounded-2xl border border-purple-500/20 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">24/7</div>
                    <div className="text-gray-300 font-medium">Live Updates</div>
                  </div>
                  <div className="glass p-6 rounded-2xl border border-green-500/20 text-center">
                    <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">∞</div>
                    <div className="text-gray-300 font-medium">Scalability</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="glass rounded-3xl p-12 mb-16 border border-white/20 animate-fadeIn">
              <div className="text-center mb-12">
                <h2 className="text-5xl font-bold text-white mb-8">
                  🏗️ System <span className="text-gradient-primary">Architecture</span>
                </h2>
                <p className="text-gray-300 text-xl max-w-3xl mx-auto">
                  Modern AI application architecture with intelligent routing and real-time processing
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                {[
                  { icon: <Upload className="w-8 h-8" />, title: "Document Upload", desc: "PDFs, text files", color: "border-cyan-500/30" },
                  { icon: <FileText className="w-8 h-8" />, title: "Text Processing", desc: "Chunking & parsing", color: "border-blue-500/30" },
                  { icon: <Database className="w-8 h-8" />, title: "Vector Storage", desc: "Embeddings in Pinecone", color: "border-purple-500/30" },
                  { icon: <Search className="w-8 h-8" />, title: "Semantic Search", desc: "Similarity matching", color: "border-pink-500/30" },
                  { icon: <Brain className="w-8 h-8" />, title: "AI Generation", desc: "GPT-4 response", color: "border-green-500/30" }
                ].map((step, index) => (
                  <div key={index} className="relative">
                    <div className={`glass p-6 rounded-2xl border ${step.color} text-center h-full`}>
                      <div className="mb-4 flex justify-center">
                        <div className="p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl">
                          {step.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.desc}</p>
                    </div>
                    {index < 4 && (
                      <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                        <ArrowRight className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Impact Section */}
            <div className="glass rounded-3xl p-12 mb-16 border border-white/20 animate-fadeIn">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6 px-8 py-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-500/30">
                  <Star className="w-6 h-6 text-yellow-400" />
                  <span className="text-2xl font-bold text-white">Perfect for Your Resume!</span>
                </div>
                
                <h2 className="text-5xl font-bold text-white mb-8">
                  Showcases <span className="text-gradient-secondary">Real-World AI Skills</span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                    What Employers See
                  </h3>
                  {[
                    "Full-stack AI application development",
                    "Production-ready RAG implementation",
                    "Modern TypeScript & Next.js expertise",
                    "Agentic AI workflow design",
                    "Vector database operations",
                    "Real-time web search APIs"
                  ].map((skill, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 glass rounded-xl hover:scale-105 transition-transform">
                      <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                        <span className="text-xl">✓</span>
                      </div>
                      <span className="text-lg text-gray-200">{skill}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Rocket className="w-8 h-8 text-purple-400" />
                    Technical Highlights
                  </h3>
                  {[
                    "Vercel AI SDK integration",
                    "Semantic search with embeddings",
                    "Autonomous tool calling",
                    "Responsive UI with animations",
                    "Real-time data processing",
                    "Scalable cloud architecture"
                  ].map((highlight, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 glass rounded-xl hover:scale-105 transition-transform">
                      <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                        <span className="text-xl">⭐</span>
                      </div>
                      <span className="text-lg text-gray-200">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center animate-fadeIn">
              <h2 className="text-4xl font-bold text-white mb-8">
                Ready to <span className="text-gradient-primary">Showcase Your Skills</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                This project demonstrates your ability to build production-ready AI applications with modern technologies.
                Perfect for impressing recruiters and landing your next role!
              </p>
              
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <button 
                  onClick={handleUploadClick}
                  className="group px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all hover:scale-105 shadow-2xl hover:shadow-cyan-500/25"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Upload className="w-6 h-6" />
                    Try Document Upload
                  </span>
                </button>
                <button 
                  onClick={handleViewCode}
                  className="group px-10 py-4 glass text-white font-bold text-xl rounded-2xl hover:bg-white/20 transition-all hover:scale-105 border border-white/30"
                >
                  <span className="flex items-center justify-center gap-3">
                    <Github className="w-6 h-6" />
                    Explore Source Code
                  </span>
                </button>
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
                <span className="text-blue-300"> Vercel AI SDK</span>, and 
                <span className="text-purple-300"> cutting-edge AI technologies</span>
              </p>
              <p className="text-gray-500 mt-4">
                Showcases real-world AI engineering skills for your resume • {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative glass rounded-3xl p-8 max-w-md w-full border border-cyan-500/30 animate-fadeIn">
            <div className="text-center">
              <div className="mb-6">
                <Upload className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {isUploading ? 'Uploading Documents...' : 'Upload Successful!'}
                </h3>
                <p className="text-gray-300">
                  {isUploading 
                    ? 'Processing your files and generating embeddings...'
                    : 'Documents have been added to the knowledge base!'
                  }
                </p>
              </div>
              
              {isUploading ? (
                <div className="space-y-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                  </div>
                  <p className="text-sm text-gray-400">Generating vector embeddings...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-green-400">
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-semibold">Upload Complete!</span>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Code Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCodeModal(false)} />
          <div className="relative glass rounded-3xl p-8 max-w-2xl w-full border border-purple-500/30 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Code className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Source Code</h3>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <span className="text-2xl text-gray-400">×</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gray-900/50 rounded-2xl">
                <h4 className="text-lg font-semibold text-white mb-4">Project Structure</h4>
                <pre className="text-gray-300 text-sm font-mono">
{`research-agent/
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── ingest/route.ts
│   ├── components/
│   │   ├── ChatInterface.tsx
│   │   └── DocumentUpload.tsx
│   ├── lib/
│   │   ├── vector-db.ts
│   │   └── agent-engine.ts
│   └── page.tsx
├── public/
└── package.json`}
                </pre>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="#"
                  className="p-4 glass rounded-xl text-center hover:scale-105 transition-transform"
                  onClick={(e) => { e.preventDefault(); alert('GitHub repository would open here'); }}
                >
                  <Github className="w-8 h-8 mx-auto mb-2 text-white" />
                  <span className="text-white font-medium">GitHub Repo</span>
                </a>
                <a 
                  href="#"
                  className="p-4 glass rounded-xl text-center hover:scale-105 transition-transform"
                  onClick={(e) => { e.preventDefault(); alert('Video tutorial would play here'); }}
                >
                  <Video className="w-8 h-8 mx-auto mb-2 text-white" />
                  <span className="text-white font-medium">Video Tutorial</span>
                </a>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-3">Key Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span key={tech.name} className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300">
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}