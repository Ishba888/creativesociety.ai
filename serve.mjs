import { createServer } from 'http'
import { readFile } from 'fs/promises'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PORT = 3000

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}

const server = createServer(async (req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0])
  if (urlPath === '/') urlPath = '/index.html'
  const filePath = join(__dirname, urlPath)

  try {
    const data = await readFile(filePath)
    const ext = extname(filePath).toLowerCase()
    const contentType = mimeTypes[ext] || 'application/octet-stream'
    res.writeHead(200, { 'Content-Type': contentType })
    res.end(data)
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not found')
  }
})

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
