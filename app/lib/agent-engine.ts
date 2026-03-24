import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { queryVectorDB } from './vector-db';
import { z } from 'zod';

// Define the type for vector DB results
interface VectorDBResult {
  text: string;
  score?: number;
  source: string;
}

// Define the agent's tools
const knowledgeBaseTool = tool({
  description: "Search the uploaded documents and knowledge base for relevant information",
  parameters: z.object({
    query: z.string().describe("The search query to find relevant documents")
  }),
  execute: async ({ query }) => {
    console.log(`🔍 Searching knowledge base for: ${query}`);
    try {
      const results = await queryVectorDB(query, 5) as VectorDBResult[];
      
      if (!results || results.length === 0) {
        return "No relevant information found in the knowledge base.";
      }
      
      const context = results
        .map((result: VectorDBResult, i: number) => {
          // Handle case where score might be undefined
          const relevanceScore = result.score ? result.score.toFixed(2) : 'N/A';
          return `[Source: ${result.source || 'Unknown'}, Relevance: ${relevanceScore}]\n${result.text}`;
        })
        .join('\n\n---\n\n');
      
      return `Found ${results.length} relevant document chunks:\n\n${context}`;
    } catch (error) {
      console.error('Knowledge base search error:', error);
      return "Error searching knowledge base. Please try again.";
    }
  }
});

const webSearchTool = tool({
  description: "Search the web for current, up-to-date information",
  parameters: z.object({
    query: z.string().describe("The search query for web search")
  }),
  execute: async ({ query }) => {
    console.log(`🌐 Searching web for: ${query}`);
    
    try {
      // Using SerpAPI (Google Search)
      const response = await fetch('https://serpapi.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: query,
          api_key: process.env.SERPAPI_API_KEY,
          engine: 'google',
          num: 5
        })
      });
      
      const data = await response.json();
      
      if (data.organic_results && data.organic_results.length > 0) {
        interface WebResult {
          title: string;
          link: string;
          snippet: string;
        }
        
        const results = data.organic_results.slice(0, 3).map((result: any): WebResult => ({
          title: result.title || 'No title',
          link: result.link || '#',
          snippet: result.snippet || 'No description available'
        }));
        
        return `Web search results:\n${results.map((r: WebResult) => `• ${r.title}: ${r.snippet}\n  Source: ${r.link}`).join('\n')}`;
      }
      
      return "No web results found.";
    } catch (error) {
      console.error('Web search error:', error);
      return "Error performing web search. Please try again later.";
    }
  }
});

// Main agent function
export async function runAgent(userMessage: string) {
  const systemPrompt = `You are a Research Assistant Agent. Your job is to help users by:
1. FIRST checking if their question can be answered from the uploaded documents/knowledge base
2. If not enough info exists, search the web for current information
3. If both sources have info, combine them intelligently
4. Always cite your sources clearly

Guidelines:
- Use knowledgeBaseTool for questions about specific documents, manuals, or known information
- Use webSearchTool for current events, recent developments, or general knowledge not in documents
- For complex questions, you may use BOTH tools
- Always explain which source you're using

Current user question: ${userMessage}`;

  return streamText({
    model: openai('gpt-4-turbo-preview'),
    system: systemPrompt,
    messages: [
      { role: 'user', content: userMessage }
    ],
    tools: {
      knowledgeBaseTool,
      webSearchTool
    },
    maxSteps: 5,
    onStepFinish: (step) => {
      console.log(`Step completed: ${step.stepType}`);
    }
  });
}
