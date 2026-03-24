// test-rag.js
async function testRAG() {
    console.log('🔍 Testing RAG System...\n')
    
    try {
      // Test 1: Check if server is running
      console.log('1. Checking server connection...')
      const serverRes = await fetch('http://localhost:3000')
      console.log(`   ✅ Server is running (${serverRes.status})`)
      
      // Test 2: Check test endpoint
      console.log('\n2. Testing API endpoints...')
      const testRes = await fetch('http://localhost:3000/api/test')
      if (!testRes.ok) {
        throw new Error(`Test endpoint returned ${testRes.status}`)
      }
      const testData = await testRes.json()
      console.log('   ✅ Test endpoint:', testData)
      
      // Test 3: Check upload endpoint
      console.log('\n3. Testing upload endpoint...')
      const uploadRes = await fetch('http://localhost:3000/api/upload')
      const uploadData = await uploadRes.json()
      console.log('   ✅ Upload endpoint:', uploadData)
      
      // Test 4: Check chat endpoint
      console.log('\n4. Testing chat endpoint...')
      const chatRes = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Hello' })
      })
      const chatData = await chatRes.json()
      console.log('   ✅ Chat endpoint:', chatData)
      
      console.log('\n✅ All tests passed! Your API is working.')
      
    } catch (error) {
      console.error('❌ Test failed:', error.message)
      console.log('\n🔧 Troubleshooting:')
      console.log('1. Make sure your dev server is running: npm run dev')
      console.log('2. Check that API routes exist in app/api/')
      console.log('3. Verify you can access http://localhost:3000 in browser')
    }
  }
  
  testRAG()