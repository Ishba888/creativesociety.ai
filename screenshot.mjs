import puppeteer from 'puppeteer'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const url = process.argv[2] || 'http://localhost:3000'
const label = process.argv[3] || ''

const screenshotsDir = join(__dirname, 'temporary screenshots')
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true })

const existing = readdirSync(screenshotsDir).filter(f => f.endsWith('.png'))
const nums = existing
  .map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1] || '0'))
  .filter(n => !isNaN(n) && n > 0)
const next = nums.length ? Math.max(...nums) + 1 : 1

const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`
const filepath = join(screenshotsDir, filename)

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
await new Promise(r => setTimeout(r, 1000))
await page.screenshot({ path: filepath, fullPage: true })
await browser.close()

console.log(`Screenshot saved: temporary screenshots/${filename}`)
