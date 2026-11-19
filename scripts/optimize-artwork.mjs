import sharp from 'sharp'
import { mkdir, copyFile, stat } from 'node:fs/promises'

await mkdir('reference/generated', { recursive: true })
for (const name of ['key-constellation', 'memory-unfolding']) {
  const source = 'reference/generated/' + name + '.png'
  try { await stat(source) } catch { await copyFile('public/artwork/' + name + '.png', source) }
  await sharp(source).webp({ quality: 88, effort: 6 }).toFile('public/artwork/' + name + '.webp')
  const info = await sharp(source).metadata()
  console.log(name + ': ' + info.width + ' × ' + info.height)
}
