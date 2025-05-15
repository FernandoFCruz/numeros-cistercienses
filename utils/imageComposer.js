const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

async function composeNumberImage(numbers, imgDir, outputPath) {
  try {
    // Verifica/Cria o diretório de saída
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const images = await Promise.all(
      numbers.map(async (n) => {
        const file = path.join(imgDir, `${n}.png`);
        try {
          return await sharp(file).ensureAlpha();
        } catch (err) {
          console.error(`❌ Erro ao carregar o dígito ${n}:`, err.message);
          throw new Error(`Falha ao processar o dígito ${n}`);
        }
      })
    );

    const metadata = await Promise.all(images.map((img) => img.metadata()));
    const width = Math.max(...metadata.map((m) => m.width));
    const height = Math.max(...metadata.map((m) => m.height));

    await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite(
        await Promise.all(
          images.map(async (img) => {
            const buffer = await img.resize(width, height, { fit: 'contain', background: 'transparent' }).toBuffer();
            return { input: buffer, top: 0, left: 0 };
          })
        )
      )
      .png()
      .toFile(outputPath);

  } catch (err) {
    console.error('🔥 Erro ao compor a imagem:', err.message);
    throw err; // Re-lança para ser tratado no Express
  }
}

module.exports = { composeNumberImage };