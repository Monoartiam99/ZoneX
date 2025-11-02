const http = require('http')

const payload = JSON.stringify({
  game: 'Free Fire',
  time: '9:00 PM',
  entryFee: 49,
  slots: 50,
  prizePool: 49*50
})

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/admin/tournaments',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload),
    'x-admin-token': process.env.ADMIN_TOKEN || 'demo-admin-token'
  }
}

const req = http.request(options, res => {
  let data = ''
  res.on('data', chunk => data += chunk)
  res.on('end', () => {
    console.log('Status:', res.statusCode)
    console.log('Response:', data)
  })
})

req.on('error', err => console.error('Request error', err))
req.write(payload)
req.end()
