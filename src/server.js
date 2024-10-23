const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'files/' });

app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/files', (req, res) => {
  const filesDir = path.join(__dirname, 'files');
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Error reading files directory' });
    } else {
      res.json(files.filter(file => file.endsWith('.csv')));
    }
  });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const oldPath = req.file.path;
    const newPath = path.join(__dirname, 'files', req.file.originalname);
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        res.status(500).json({ error: 'Error saving file' });
      } else {
        res.json({ message: 'File uploaded successfully' });
      }
    });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});