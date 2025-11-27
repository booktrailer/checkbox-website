const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Static files are served by Vercel from public/ folder

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


// Export app for Vercel serverless deployment
module.exports = app;