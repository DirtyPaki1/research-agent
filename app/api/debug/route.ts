import { NextResponse } from 'next/server'

import { getDocuments } from '@/app/lib/store'

export async function GET() {
  const documents = getDocuments()
  
  return NextResponse.json({
    status: 'ok',
    documentCount: documents.length,
    documents: documents.map(d => ({
      id: d.id,
      filename: d.filename,
      size: d.size,
      uploadedAt: d.uploadedAt,
      preview: d.preview.substring(0, 100)
    })),
    env: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nodeEnv: process.env.NODE_ENV
    }
  })
}