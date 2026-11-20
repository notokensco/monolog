import sharp from 'sharp'
import { mkdir, readFile, copyFile, writeFile } from 'node:fs/promises'

const { assets } = JSON.parse(await readFile('reference/hero-keys-v2.json', 'utf8'))
await mkdir('reference/generated/keys-v2', { recursive: true })
await mkdir('public/artwork/keys-v2', { recursive: true })
let html = await readFile('index.html', 'utf8')
for (const { name, source } of assets) {
  const original = `reference/generated/keys-v2/${name}.png`
  try { await readFile(original) } catch { await copyFile(source, original) }
  const destination = `public/artwork/keys-v2/${name}.webp`
  // Trim transparent margins, retaining the generated alpha and soft object edges.
  await sharp(original).trim({ threshold: 8 }).resize({ width: name === 'monolog-key' ? 960 : 800, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(destination)
  const { width, height, hasAlpha } = await sharp(destination).metadata()
  const stats = await sharp(destination).stats()
  console.log(`${name}: ${width} × ${height}; alpha ${hasAlpha}; alpha range ${stats.channels[3]?.min}–${stats.channels[3]?.max}`)
  html = html.replaceAll(new RegExp(`src="/artwork/keys-v2/${name}\\.webp"(?: width="\\d+" height="\\d+")?`, 'g'), `src="/artwork/keys-v2/${name}.webp" width="${width}" height="${height}"`)
}
await writeFile('index.html', html)
