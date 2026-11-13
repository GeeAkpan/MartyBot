// Generates src/assets/telegram-qr.svg — run with: node scripts/gen-qr.mjs
import { writeFileSync } from 'node:fs'
import QRCode from 'qrcode'

const svg = await QRCode.toString('https://t.me/martytraderbot', {
  type: 'svg',
  margin: 1,
  errorCorrectionLevel: 'M',
  color: { dark: '#0b1c2aff', light: '#f5ecd7ff' },
})
writeFileSync(new URL('../src/assets/telegram-qr.svg', import.meta.url), svg)
console.log('QR written')
