'use client';

import { useState } from 'react';

interface DocumentUploadProps {
  onClose: () => void;
}

export default function DocumentUpload({ onClose }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !text.trim()) {
      alert('Please select a file or enter text');
      return;
    }
    
    setUploading(true);
    setResult(null);
    
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (text.trim()) formData.append('text', text);
    formData.append('source', file ? file.name : 'manual-input');
    
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        setFile(null);
        setText('');
        setTimeout(() => {
          alert(`✅ Successfully added ${data.chunks} document chunks to knowledge base!`);
        }, 100);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResult({ success: false, message: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Upload to Knowledge Base</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>
      
      <form onSubmit={handleFileUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF or Text File
          </label>
          <input
            type="file"
            accept=".pdf,.txt,.md"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={uploading}
          />
        </div>
        
        <div className="text-sm text-gray-500 text-center">OR</div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Text Directly
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste any text, documentation, or notes here..."
            className="w-full p-3 border border-gray-300 rounded h-32"
            disabled={uploading}
          />
        </div>
        
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? 'Processing...' : 'Add to Knowledge Base'}
        </button>
      </form>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {result.message}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>📚 <strong>What to upload:</strong></p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>Company documentation</li>
          <li>Technical manuals</li>
          <li>API references</li>
          <li>Research papers</li>
          <li>Meeting notes</li>
        </ul>
      </div>
    </div>
  );
}