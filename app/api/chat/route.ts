import { NextRequest, NextResponse } from 'next/server'

import { getDocuments } from '@/app/lib/store'
import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Helper function to estimate tokens (rough estimate: 4 chars ≈ 1 token)
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

// Helper function to truncate text to fit token limit
function truncateToTokenLimit(text: string, maxTokens: number): string {
  const estimatedTokens = estimateTokens(text)
  if (estimatedTokens <= maxTokens) return text
  
  // Truncate to approximate max tokens (leave buffer for system prompt)
  const maxChars = maxTokens * 4
  return text.substring(0, maxChars) + `\n\n[Content truncated due to length. Full document is ${text.length} characters.]`
}

export async function POST(request: NextRequest) {
  console.log('💬 Chat endpoint called')
  
  try {
    const { message } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      )
    }

    console.log('Question:', message.substring(0, 50))
    
    // Get documents from shared store
    const documents = getDocuments()
    console.log(`📚 Found ${documents.length} documents in store`)
    
    // Log document details for debugging
    documents.forEach((doc, i) => {
      console.log(`📄 Document ${i+1}: ${doc.filename} (${doc.content.length} chars, ~${estimateTokens(doc.content)} tokens)`)
    })
    
    // If no documents, return early
    if (documents.length === 0) {
      return NextResponse.json({
        response: "I don't see any documents in your knowledge base yet. Try uploading a file first using the 'Upload Docs' button!",
        contextFound: false,
        documentCount: 0
      })
    }
    
    // Check if the user is explicitly asking for a list of documents
    const isAskingForList = message.toLowerCase().match(/\b(list|show|what.*have|how many)\b/) && 
                            message.toLowerCase().includes('document')
    
    if (isAskingForList) {
      const docList = documents.map((doc, i) => 
        `${i+1}. **${doc.filename}** (${Math.round(doc.size/1024)} KB, ~${estimateTokens(doc.content)} tokens)`
      ).join('\n')
      
      return NextResponse.json({
        response: `You have ${documents.length} document(s) in your knowledge base:\n\n${docList}\n\nWhat would you like to know about them?`,
        contextFound: true,
        documentCount: documents.length
      })
    }
    
    // Calculate total tokens
    const totalEstimatedTokens = documents.reduce((sum, doc) => sum + estimateTokens(doc.content), 0)
    console.log(`📊 Total estimated tokens: ${totalEstimatedTokens}`)
    
    // Build context with truncation if needed
    let context = "Here are the uploaded documents. Some may be truncated due to length:\n\n"
    let totalChars = 0
    const MAX_TOKENS = 12000 // Leave buffer for system prompt and response
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i]
      const docTokens = estimateTokens(doc.content)
      const currentTotalTokens = estimateTokens(context + doc.content)
      
      if (currentTotalTokens > MAX_TOKENS) {
        // Truncate this document
        const remainingTokens = MAX_TOKENS - estimateTokens(context)
        const maxChars = remainingTokens * 4
        context += `[DOCUMENT ${i + 1}: ${doc.filename} (truncated)]\n`
        context += doc.content.substring(0, maxChars)
        context += `\n\n[Document truncated. Full length: ${doc.content.length} characters]\n---\n\n`
        console.log(`⚠️ Truncated ${doc.filename} to fit token limit`)
        break
      } else {
        context += `[DOCUMENT ${i + 1}: ${doc.filename}]\n`
        context += doc.content + '\n---\n\n'
        totalChars += doc.content.length
      }
    }
    
    console.log(`📤 Sending context to OpenAI (${context.length} chars, ~${estimateTokens(context)} tokens)`)
    
    // If no OpenAI key, return document info directly
    if (!process.env.OPENAI_API_KEY) {
      // Extract and return content previews
      const contentPreviews = documents.map((doc, i) => {
        const preview = doc.content.substring(0, 300) + (doc.content.length > 300 ? '...' : '')
        return `${i+1}. ${doc.filename}\n   Preview: ${preview}`
      }).join('\n\n')
      
      return NextResponse.json({
        response: `I found ${documents.length} document(s). Here's what they contain:\n\n${contentPreviews}`,
        contextFound: true,
        documentCount: documents.length
      })
    }
    
    try {
      // Create a prompt that explicitly asks for content analysis
      const systemPrompt = `You are an AI assistant that analyzes uploaded documents. 
      
You have access to the following documents (some may be truncated):

${context}

IMPORTANT INSTRUCTIONS:
1. ALWAYS analyze the actual document content above when answering questions
2. Provide specific information, quotes, and details from the documents
3. If a document is truncated, work with what you have
4. Never ask the user what they want to know - just analyze what's there
5. Reference which document you're getting information from

The documents contain real text. Use it to answer questions thoroughly.`

      console.log('🤖 Sending to OpenAI with system prompt')
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })
      
      const response = completion.choices[0].message.content || ''
      console.log('✅ Received response from OpenAI')
      
      // Add source note with truncation warning if needed
      let finalResponse = response
      if (totalEstimatedTokens > MAX_TOKENS) {
        finalResponse += `\n\n⚠️ *Note: Some documents were truncated to fit token limits. For complete analysis, try asking about specific documents or use shorter files.*`
      }
      finalResponse += `\n\n📚 *Based on ${documents.length} document${documents.length > 1 ? 's' : ''} in your knowledge base*`
      
      return NextResponse.json({
        response: finalResponse,
        contextFound: true,
        documentCount: documents.length
      })
      
    } catch (openaiError: any) {
      console.error('❌ OpenAI error:', openaiError)
      
      // Fallback - return actual content from documents (truncated)
      const contentSummaries = documents.map((doc, i) => {
        const preview = doc.content.substring(0, 500) + (doc.content.length > 500 ? '...' : '')
        return `**${doc.filename}**:\n${preview}`
      }).join('\n\n---\n\n')
      
      return NextResponse.json({
        response: `I found ${documents.length} document(s). Here's the content I can show you (limited by token constraints):\n\n${contentSummaries}`,
        contextFound: true,
        documentCount: documents.length
      })
    }
    
  } catch (error: any) {
    console.error('❌ Chat error:', error)
    return NextResponse.json({
      response: 'Sorry, I encountered an error. Please try again.'
    })
  }
}