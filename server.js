const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const wordsFile = path.join(__dirname, 'words.json');

app.use(express.static(__dirname));
app.use(express.json());

function readWords() {
  try {
    return JSON.parse(fs.readFileSync(wordsFile, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeWords(words) {
  fs.writeFileSync(wordsFile, JSON.stringify(words, null, 2));
}

app.get('/api/words', (req, res) => {
  res.json(readWords());
});

app.post('/api/words', (req, res) => {
  const { de, en } = req.body;
  if (!de || !en) {
    return res.status(400).json({ error: 'Both de and en fields are required.' });
  }
  const words = readWords();
  words.push({ de, en });
  writeWords(words);
  res.status(201).json({ message: 'Word added.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
