import { NextRequest, NextResponse } from 'next/server'

import { addDocument, getDocuments, StoredDocument } from '@/app/lib/store'
import { extractTextFromFile, isReadableText } from '@/app/lib/processor'

export async function POST(request: NextRequest) {
  console.log('📤 Upload endpoint called')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log(`📄 Processing: ${file.name} (${file.size} bytes, type: ${file.type})`)
    
    // Extract text based on file type
    const text = await extractTextFromFile(file)
    
    // Check if we got readable text
    const readable = isReadableText(text)
    
    // Create document object
    const document: StoredDocument = {
      id: Date.now().toString(),
      filename: file.name,
      content: text,
      preview: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      isReadable: readable
    }
    
    // Store in shared memory
    addDocument(document)
    
    const tokenEstimate = Math.ceil(text.length / 4)
    const response: any = {
      success: true,
      filename: file.name,
      message: readable ? 'Document processed successfully' : 'Document stored but may not be readable',
      preview: document.preview,
      documentId: document.id,
      stored: true,
      readable
    }
    
    if (!readable) {
      response.warning = 'This file does not contain readable text. Try uploading a plain text file.'
    } else if (tokenEstimate > 12000) {
      response.warning = `This file is large (~${tokenEstimate} tokens). You may need to ask specific questions.`
    }
    
    return NextResponse.json(response)
    
  } catch (error: any) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET() {
  console.log('📚 GET /api/upload called')
  
  const documents = getDocuments()
  
  return NextResponse.json({
    documents: documents.map(doc => ({
      filename: doc.filename,
      preview: doc.preview,
      uploadTime: new Date(doc.uploadedAt).toLocaleString(),
      size: doc.size,
      readable: doc.isReadable || false,
      tokenEstimate: Math.ceil(doc.content.length / 4)
    }))
  })
}