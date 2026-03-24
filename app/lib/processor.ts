import pdf from 'pdf-parse'

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  
  // Check if it's a PDF by file extension or MIME type
  if (file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const data = await pdf(buffer)
      return data.text // Extracted text from PDF
    } catch (error) {
      console.error('PDF parsing error:', error)
      return `[Error: Could not extract text from PDF. The file may be scanned or corrupted.]`
    }
  }
  
  // For text files, just decode
  return new TextDecoder().decode(buffer)
}

// Helper to check if content is readable
export function isReadableText(content: string): boolean {
  // Check if content has mostly printable characters
  const printable = content.split('').filter(c => {
    const code = c.charCodeAt(0)
    return code >= 32 && code <= 126 || code === 10 || code === 13 // printable ASCII + newlines
  }).length
  
  return (printable / content.length) > 0.8 // 80% printable characters
}