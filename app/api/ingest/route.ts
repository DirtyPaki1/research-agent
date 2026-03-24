import { NextRequest, NextResponse } from 'next/server';
import { processPDF, processText } from '../../lib/document-processor';
import { storeDocument } from '../../lib/vector-db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const text = formData.get('text') as string;
    const source = formData.get('source') as string || 'user-upload';
    
    let chunks;
    
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      if (file.type === 'application/pdf') {
        chunks = await processPDF(buffer, file.name);
      } else if (file.type.startsWith('text/')) {
        const textContent = buffer.toString('utf-8');
        chunks = await processText(textContent, file.name);
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 }
        );
      }
    } else if (text) {
      chunks = await processText(text, source);
    } else {
      return NextResponse.json(
        { error: 'No file or text provided' },
        { status: 400 }
      );
    }
    
    const count = await storeDocument(chunks);
    
    return NextResponse.json({
      success: true,
      message: `Successfully processed ${count} chunks from ${file ? file.name : source}`,
      chunks: count
    });
    
  } catch (error) {
    console.error('Ingestion error:', error);
    return NextResponse.json(
      { error: 'Failed to process document' },
      { status: 500 }
    );
  }
}