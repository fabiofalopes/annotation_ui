const express = require('express');
const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const app = express();
const port = 3722;

app.use(express.json());

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

const multer = require('multer');
const upload = multer({ dest: 'files/' });

// Endpoint para copiar arquivo .csv para o pasta 'files'
app.post('/api/copy-to-files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const sourceFile = req.file.path;
  const destinationFileName = req.body.destinationFileName;
  const destinationPath = path.join(__dirname, 'files', destinationFileName);

  try {
    // Strict check - if file exists, reject immediately
    if (fs.existsSync(destinationPath)) {
      // Clean up the temporary file
      fs.unlinkSync(sourceFile);
      return res.status(403).json({
        success: false,
        message: 'CANNOT PROCEED: A file with this name already exists in the workspace. To protect your existing annotations, this operation is not allowed.',
      });
    }

    // Only proceed if the file doesn't exist
    fs.renameSync(sourceFile, destinationPath);
    res.json({
      success: true,
      message: 'File copied successfully',
      filePath: destinationPath
    });
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(sourceFile)) {
      fs.unlinkSync(sourceFile);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to process file',
      error: error.message
    });
  }
});

// Endpoint para gravar os CSV
app.post('/api/save-csv', (req, res) => {
  const { messages, tags, fileName } = req.body;
  const filePath = path.join(__dirname, 'files', fileName);

  // Ensure the 'files' directory exists
  if (!fs.existsSync(path.join(__dirname, 'files'))) {
    fs.mkdirSync(path.join(__dirname, 'files'));
  }

  const csvData = messages.map(message => ({
    user_id: message.user_id,
    turn_id: message.turn_id,
    turn_text: message.turn_text,
    reply_to_turn: message.reply_to_turn,
    thread: message.thread,
    annotator: message.annotator || '',
    description: tags[message.thread]?.description || '',
    usage_count: tags[message.thread]?.references.length || 0,
    created: tags[message.thread]?.created || '',
  }));

  const csv = Papa.unparse(csvData);

  try {
    fs.writeFileSync(filePath, csv, 'utf8');
    res.json({ success: true, message: 'CSV file saved successfully' });
  } catch (error) {
    console.error('Error saving CSV file:', error);
    res.status(500).json({ success: false, message: 'Failed to save CSV file', error: error.message });
  }
});

// Endpoint para listar todos os CSVs do workspace
app.get('/api/workspace-files', (req, res) => {
  const filesDir = path.join(__dirname, 'files');

  try {
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir);
    }

    const files = fs.readdirSync(filesDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => {
        const stats = fs.statSync(path.join(filesDir, file));
        return {
          name: file,
          lastModified: stats.mtime,
          size: stats.size
        };
      });

    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read workspace files' });
  }
});

// Endpoint para obter um csv por filename do workspace
app.get('/api/workspace-file/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

// Endpoint para abrir a pasta do workspace no file explorer do sistema
app.post('/api/open-workspace-folder', (req, res) => {
  const filesDir = path.join(__dirname, 'files');

  if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
  }

  // Platform-specific commands to open folder
  const command = process.platform === 'win32' ?
    `explorer "${filesDir}"` :
    process.platform === 'darwin' ?
      `open "${filesDir}"` :
      `xdg-open "${filesDir}"`;

  exec(command, (error) => {
    if (error) {
      console.error('Error opening folder:', error);
      res.status(500).json({ error: 'Failed to open folder' });
    } else {
      res.json({ success: true });
    }
  });
});

// Endpoint para renomear um csv no workspace
app.put('/api/workspace-file/rename', (req, res) => {
  const { oldName, newName } = req.body;

  // Validate input
  if (!oldName || !newName) {
    return res.status(400).json({
      error: 'Both oldName and newName are required'
    });
  }

  const oldPath = path.join(__dirname, 'files', oldName);

  // Ensure new filename has .csv extension
  const newNameWithExt = newName.endsWith('.csv') ? newName : `${newName}.csv`;
  const newPath = path.join(__dirname, 'files', newNameWithExt);

  try {
    // Check if source file exists
    if (!fs.existsSync(oldPath)) {
      return res.status(404).json({
        error: 'Source file not found'
      });
    }

    // Check if destination file already exists
    if (fs.existsSync(newPath)) {
      return res.status(409).json({
        error: 'A file with this name already exists'
      });
    }

    // Perform the rename
    fs.renameSync(oldPath, newPath);

    // Send success response
    res.json({
      success: true,
      oldName: oldName,
      newName: newNameWithExt
    });
  } catch (error) {
    console.error('Error renaming file:', error);
    res.status(500).json({
      error: 'Failed to rename file',
      details: error.message
    });
  }
});

// Endpoint para eliminar um csv do workspace
app.delete('/api/workspace-file/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'files', req.params.filename);

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Endpoint para duplicar o csv no workspace
app.post('/api/workspace-file/duplicate', (req, res) => {
  const { filename } = req.body;
  const filesDir = path.join(__dirname, 'files');
  const originalPath = path.join(filesDir, filename);

  try {
    if (!fs.existsSync(originalPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const nameWithoutExt = filename.replace('.csv', '');
    const ext = '.csv';
    let copyNumber = 1;
    let newFilename;

    // Find the next available copy number
    do {
      newFilename = `${nameWithoutExt}-copy${copyNumber}${ext}`;
      copyNumber++;
    } while (fs.existsSync(path.join(filesDir, newFilename)));

    fs.copyFileSync(originalPath, path.join(filesDir, newFilename));
    res.json({ success: true, newFilename });
  } catch (error) {
    res.status(500).json({ error: 'Failed to duplicate file' });
  }
});

const { exec } = require('child_process'); // Make sure this is at the top with other requires

// Handler para rotas não encontradas - retorna página inicial React
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  console.log('Server is ready to handle requests');
});

// Endpoint de teste para verificar se o servidor está em cima
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working correctly' });
});

