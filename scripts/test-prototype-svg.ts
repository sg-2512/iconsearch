import { GET, OPTIONS } from '../app/api/svg/[library]/[name]/route'

async function run() {
  console.log('Testing GET route handler direct invocation...')
  const req = new Request('http://localhost:3000/api/svg/akar-icons/air')
  const res = await GET(req, { params: Promise.resolve({ library: 'akar-icons', name: 'air' }) })
  console.log('Status:', res.status)
  console.log('Content-Type:', res.headers.get('content-type'))
  const text = await res.text()
  console.log('Body length:', text.length)
  console.log('Starts with <svg:', text.startsWith('<svg'))
  console.log('Preview:', text.slice(0, 100))
}

run().catch(console.error)
