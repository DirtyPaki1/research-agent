'use client';

import { Message } from 'ai';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`mb-4 ${isUser ? 'text-right' : ''}`}>
      <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
        isUser 
          ? 'bg-blue-100 text-blue-900 rounded-br-none' 
          : 'bg-gray-100 text-gray-900 rounded-bl-none'
      }`}>
        <div className="font-medium mb-1">
          {isUser ? 'You' : 'Research Assistant'}
        </div>
        
        <div className="whitespace-pre-wrap">
          {message.content}
        </div>
        
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <div className="text-sm font-medium text-gray-700 mb-1">
              🔧 Tools used:
            </div>
            {message.toolInvocations.map((invocation, idx) => (
              <div key={idx} className="text-xs bg-white p-2 rounded mb-2">
                <div className="font-mono">
                  {invocation.toolName}: {invocation.args?.query || 'N/A'}
                </div>
                <div className="text-gray-600 mt-1">
                  { invocation.result && (
                    <details>
                      <summary className="cursor-pointer">View tool result</summary>
                      <pre className="mt-1 p-2 bg-gray-50 rounded overflow-auto text-xs">
                        {invocation.result}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}