'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import MessageBubble from './MessageBubble';
import DocumentUpload from './DocumentUpload';

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error);
      alert('Error: ' + error.message);
    }
  });
  
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Research Assistant Agent</h1>
        <p className="text-gray-600 mt-2">
          Ask questions. I'll search your documents or the web intelligently.
        </p>
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
          >
            {showUpload ? 'Hide Upload' : 'Upload Documents'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Clear Chat
          </button>
        </div>
        
        {showUpload && <DocumentUpload onClose={() => setShowUpload(false)} />}
      </header>

      <div className="flex-1 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p className="text-lg">Welcome to your Research Assistant!</p>
            <p className="mt-2">Try asking:</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• "What does our user manual say about troubleshooting?"</li>
              <li>• "Find recent developments in AI agent frameworks"</li>
              <li>• "Combine info from our docs with current best practices"</li>
            </ul>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}
        
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex items-center gap-2 text-gray-500 mt-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span>Agent is thinking and researching...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question... (I'll search docs or web as needed)"
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          💡 <strong>How it works:</strong> The agent automatically decides whether to search your uploaded documents, 
          search the web, or use both based on your question.
        </p>
      </div>
    </div>
  );
}