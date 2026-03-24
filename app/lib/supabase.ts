import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || ''

console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Present' : '❌ Missing',
  serviceKey: supabaseServiceKey ? '✅ Present' : '❌ Missing',
  anonKey: supabaseAnonKey ? '✅ Present' : '❌ Missing'
})

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials. Check your .env.local file')
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection and table
export async function testSupabaseConnection() {
  try {
    // Test 1: Basic connection
    const { data, error: connectionError } = await supabaseAdmin
      .from('documents')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      if (connectionError.code === '42P01') {
        return { 
          connected: false, 
          error: 'Table "documents" does not exist. Run the SQL setup first.',
          code: 'table_not_found'
        }
      }
      return { 
        connected: false, 
        error: connectionError.message,
        code: connectionError.code
      }
    }
    
    // Test 2: Check vector extension
    const { error: vectorError } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: Array(1536).fill(0),
      match_threshold: 0,
      match_count: 1
    })
    
    return {
      connected: true,
      vectorSearch: !vectorError,
      vectorError: vectorError?.message,
      tableExists: true
    }
    
  } catch (error: any) {
    return { 
      connected: false, 
      error: error.message 
    }
  }
}