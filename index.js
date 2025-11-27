const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (images, CSS, etc.)
app.use(express.static(__dirname));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Serve header component
app.get('/header.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'header.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});