// Option A: Pinecone
import { Pinecone } from '@pinecone-database/pinecone';
import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { RecordMetadata, ScoredPineconeRecord } from '@pinecone-database/pinecone';

// Define the type for our document chunks
interface DocumentChunk {
  text: string;
  metadata: any;
}

// Define the return type for queryVectorDB
export interface QueryResult {
  text: string;
  score: number;
  source: string;
}

// Lazy initialization to avoid build-time errors
let pineconeInstance: Pinecone | null = null;
let indexInstance: any = null;

function getPineconeClient() {
  if (!pineconeInstance) {
    const apiKey = process.env.PINECONE_API_KEY;
    
    if (!apiKey) {
      // During build time, return a mock client
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
        console.warn('Pinecone API key not found during build - using mock client');
        return null;
      }
      throw new Error('PINECONE_API_KEY is not set');
    }
    
    pineconeInstance = new Pinecone({ apiKey });
  }
  return pineconeInstance;
}

function getIndex() {
  if (!indexInstance) {
    const client = getPineconeClient();
    if (!client) {
      // Return mock index during build
      return {
        upsert: async () => {},
        query: async () => ({ matches: [] })
      };
    }
    indexInstance = client.index('research-docs');
  }
  return indexInstance;
}

export async function storeDocument(chunks: DocumentChunk[]) {
  try {
    const index = getIndex();
    
    const vectors = await Promise.all(
      chunks.map(async (chunk) => {
        const { embedding } = await embed({
          model: openai.embedding('text-embedding-3-small'),
          value: chunk.text,
        });
        return {
          id: `doc_${Date.now()}_${Math.random()}`,
          values: embedding,
          metadata: {
            ...chunk.metadata,
            text: chunk.text.substring(0, 1000) // Store preview in metadata
          },
        };
      })
    );
    
    await index.upsert(vectors);
    return vectors.length;
  } catch (error) {
    console.error('Error storing documents:', error);
    // During build, return 0 instead of failing
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return 0;
    }
    throw error;
  }
}

export async function queryVectorDB(query: string, topK = 5): Promise<QueryResult[]> {
  try {
    const index = getIndex();
    
    const { embedding } = await embed({
      model: openai.embedding('text-embedding-3-small'),
      value: query,
    });
    
    const results = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    });
    
    // Type-safe mapping of results
    return (results.matches || []).map((match: ScoredPineconeRecord<RecordMetadata>) => ({
      text: (match.metadata?.text as string) || '',
      score: match.score || 0,
      source: (match.metadata?.source as string) || 'Unknown',
    }));
  } catch (error) {
    console.error('Error querying vector DB:', error);
    // During build, return empty array instead of failing
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return [];
    }
    throw error;
  }
}
