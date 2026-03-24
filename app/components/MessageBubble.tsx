import { Message } from 'ai';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isUser 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-100 text-gray-900'
      }`}>
        <div className="font-medium mb-1">
          {isUser ? 'You' : 'Assistant'}
        </div>
        <div>{message.content}</div>
        
        {/* Handle tool invocations if present */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="mt-2 text-xs border-t pt-2">
            {message.toolInvocations.map((invocation, idx) => (
              <div key={idx} className="mt-1">
                <div className="font-medium">Tool: {invocation.toolName}</div>
                
                {/* Check if this is a tool call (no result yet) */}
                {'result' in invocation && invocation.result && (
                  <details>
                    <summary className="cursor-pointer">View tool result</summary>
                    <pre className="mt-1 p-2 bg-gray-50 rounded overflow-auto text-xs">
                      {JSON.stringify(invocation.result, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
