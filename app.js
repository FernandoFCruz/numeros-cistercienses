const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { exec } = require('child_process');
const { composeNumberImage } = require('./utils/imageComposer');
const cors = require('cors');  // Adicione esta linha

const app = express();
app.use(cors());  // Adicione esta linha
const PORT = 3000;

const upload = multer({ dest: path.join(__dirname, 'uploads') });
const { spawn } = require('child_process');

app.use(express.static('public'));
app.use('/output', express.static(path.join(__dirname, 'output')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/generate', async (req, res) => {
  try {
    const { number } = req.body;
    
    // Validação rigorosa
    if (number < 1 || number > 9999) {
      return res.status(400).json({ error: "Número inválido. Use um valor entre 1 e 9999"  });
    }

    const digits = decomposeNumber(number);
    const filename = `${number}.png`;
    const outputPath = path.join(__dirname, 'output', filename);

    // Verifica se diretório output existe
    if (!fs.existsSync(path.join(__dirname, 'output'))) {
      fs.mkdirSync(path.join(__dirname, 'output'));
    }

    await composeNumberImage(digits, path.join(__dirname, 'number-images'), outputPath);
    
    res.json({ image: `/output/${filename}` });

  } catch (err) {
    console.error('Erro crítico:', err);
    res.status(500).json({ error: "Falha ao processar a imagem" });
  }
});

app.post('/upload', upload.single('image'), async (req, res) => {
    try {
      const imagePath = req.file.path;
      const scriptPath = path.join(__dirname, 'python', 'recognize_number.py');
      const datasetPath = path.join(__dirname, 'dataset-numbers');
  
      const pythonProcess = spawn('python', [scriptPath, imagePath, datasetPath]);
  
      let result = '';
      let errorLog = '';
  
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });
  
      pythonProcess.stderr.on('data', (data) => {
        // Exibe os logs linha a linha no terminal do Node
        process.stdout.write(data.toString());
        errorLog += data.toString();
      });
  
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Erro no script Python:', errorLog);
          return res.status(500).send('Erro ao processar a imagem.');
        }
  
        const [number, score] = result.trim().split('|');
  
        res.json({
          number: Number(number),
          score: parseFloat(score),
          message: `A imagem inserida representa o número ${number} (similaridade: ${score}).`
        });
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Erro ao processar a imagem.');
    }
  });

function decomposeNumber(n) {
  return n.toString()
          .split('')
          .map(Number)
          .filter(digit => digit !== 0);
}


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
