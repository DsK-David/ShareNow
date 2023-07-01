const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Configuração do Multer para o armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.static('public'));

// Rota principal para renderizar o formulário de upload
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Rota para o upload de arquivos
app.post('/ShareNow/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  const sharedLink = `${req.protocol}://share-now-wheat.vercel.app/shared/${req.file.filename}`;
  res.send(`Arquivo compartilhado com sucesso! Envie o link a seguir ao seu amigo: ${sharedLink}`);
});

// Rota para listar os arquivos compartilhados
app.get('/ShareNow/shared', (req, res) => {
  const sharedDir = path.join(__dirname, 'uploads');

  fs.readdir(sharedDir, (err, files) => {
    if (err) {
      console.error('Erro ao ler a pasta compartilhada:', err);
      return res.status(500).send('Erro ao acessar a pasta compartilhada.');
    }

    const fileLinks = files.map(file => ({
      name: file,
      link: `${req.protocol}://${req.get('host')}/shared/${file}`
    }));

    const html = `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <h2><i class="fas fa-file-alt"></i> Arquivos compartilhados</h2>
    <ul class="file-list">
      ${fileLinks.map(file => `<li><a style="color:blue"; href="${file.link}"><i class="fas fa-file"></i> ${file.name}</a></li>`).join('')}
    </ul>
  `;
  
  res.send(html);
  });
});

// Rota para fazer o download de um arquivo compartilhado
app.get('ShareNow/shared/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Erro ao fazer o download do arquivo:', err);
      res.status(500).send('Download feito');
    }
  });
});

// Inicia o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
