const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const path = require('path');

// Initialize DOMPurify for server-side use
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const app = express();
const port = process.env.PORT || 3000;

// Rate limiting middleware
const submitLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 1, // 1 submission per day per IP
  message: {
    success: false,
    message: 'You can only submit one school per day. Please try again tomorrow.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (images, CSS, etc.)
app.use(express.static(__dirname));

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Serve add school page
app.get('/add-school', (req, res) => {
  res.sendFile(path.join(__dirname, 'add-school.html'));
});

// Serve header component
app.get('/header.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'header.html'));
});

// Handle school submissions with rate limiting
app.post('/submit-school', submitLimiter, async (req, res) => {
  try {
    const { schoolName, schoolUrl, submitterName, notes } = req.body;
    
    // Basic validation
    if (!schoolName || !schoolUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'School name and URL are required.' 
      });
    }

    // Input length validation
    const maxLengths = {
      schoolName: 100,
      schoolUrl: 200,
      submitterName: 50,
      notes: 300
    };

    if (schoolName.length > maxLengths.schoolName) {
      return res.status(400).json({ 
        success: false, 
        message: `School name must be ${maxLengths.schoolName} characters or less.` 
      });
    }

    if (schoolUrl.length > maxLengths.schoolUrl) {
      return res.status(400).json({ 
        success: false, 
        message: `School URL must be ${maxLengths.schoolUrl} characters or less.` 
      });
    }

    if (submitterName && submitterName.length > maxLengths.submitterName) {
      return res.status(400).json({ 
        success: false, 
        message: `Name must be ${maxLengths.submitterName} characters or less.` 
      });
    }

    if (notes && notes.length > maxLengths.notes) {
      return res.status(400).json({ 
        success: false, 
        message: `Notes must be ${maxLengths.notes} characters or less.` 
      });
    }
    
    // Validate URL format
    try {
      new URL(schoolUrl);
    } catch (e) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid URL.' 
      });
    }
    
    // Create new school entry with sanitized inputs
    const newSchool = {
      id: Date.now().toString(),
      schoolName: DOMPurify.sanitize(schoolName.trim()),
      schoolUrl: validator.isURL(schoolUrl.trim()) ? schoolUrl.trim() : '',
      submitterName: submitterName ? DOMPurify.sanitize(submitterName.trim()) : '',
      notes: notes ? DOMPurify.sanitize(notes.trim()) : '',
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Validate sanitized URL again
    if (!newSchool.schoolUrl) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid URL.' 
      });
    }
    
    // In production (Vercel), log the submission instead of saving to file
    // For local development, you could add a database or external storage
    console.log('School submission received:', JSON.stringify(newSchool, null, 2));
    
    // TODO: Replace with actual database storage (MongoDB, PostgreSQL, etc.)
    // For now, just accept all submissions since we can't persist to file system on Vercel
    
    res.json({ 
      success: true, 
      message: 'Thank you! Your school has been submitted successfully. We\'ll review it and work to add support soon.' 
    });
    
  } catch (error) {
    console.error('Error processing school submission:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing your submission. Please try again later.' 
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});