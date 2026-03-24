import pdf from 'pdf-parse';

export async function processPDF(buffer: Buffer, filename: string) {
  const data = await pdf(buffer);
  const text = data.text;
  
  // Split into chunks with overlap
  const chunks = splitTextIntoChunks(text, 1000, 200);
  
  return chunks.map((chunk, index) => ({
    text: chunk,
    metadata: {
      source: filename,
      chunkIndex: index,
      type: 'pdf',
      timestamp: new Date().toISOString(),
    },
  }));
}

export async function processText(text: string, source: string) {
  const chunks = splitTextIntoChunks(text, 1000, 200);
  
  return chunks.map((chunk, index) => ({
    text: chunk,
    metadata: {
      source,
      chunkIndex: index,
      type: 'text',
      timestamp: new Date().toISOString(),
    },
  }));
}

function splitTextIntoChunks(text: string, chunkSize: number, overlap: number) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + chunkSize;
    
    // Try to split at sentence boundary
    if (end < text.length) {
      const nextPeriod = text.indexOf('. ', end);
      const nextNewline = text.indexOf('\n', end);
      const splitPoint = Math.min(
        nextPeriod > end ? nextPeriod + 1 : text.length,
        nextNewline > end ? nextNewline : text.length
      );
      end = splitPoint !== -1 ? splitPoint : end;
    }
    
    chunks.push(text.slice(start, end));
    start = end - overlap;
  }
  
  return chunks;
}