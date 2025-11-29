const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 6767;

// Serve static files (images, CSS, etc.)
app.use(express.static(__dirname));

// Explicit routes (optional since static middleware handles these)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/add-school', (req, res) => {
  res.sendFile(path.join(__dirname, 'add-school.html'));
});

// Serve header component
app.get('/header.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'header.html'));
});

app.get('/logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'logo.png'));
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});