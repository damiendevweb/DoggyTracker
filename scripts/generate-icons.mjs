import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const svgPath = join(root, 'public', 'Courbe.svg')
const outDir = join(root, 'public', 'icons')

const svg = await readFile(svgPath)

const sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512]

await mkdir(outDir, { recursive: true })

for (const size of sizes) {
    const output = join(outDir, `icon-${size}x${size}.png`)
    const density = Math.round((size * 72) / 474)
    await sharp(svg, { density })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(output)
    const meta = await sharp(output).metadata()
    console.log(`icon-${size}x${size}.png -> ${meta.width}x${meta.height}`)
}