const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// In-memory storage for URLs
const urls = {};
let shortUrlCounter = 1;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Endpoint to create short URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  
  // Validate URL format
  const urlRegex = /^https?:\/\/www\..+/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }
  
  // Generate short URL
  const shortUrl = shortUrlCounter++;
  urls[shortUrl] = originalUrl;
  
  // Send JSON response with short URL
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to redirect short URL to original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  
  // Check if short URL exists in database
  if (!urls[shortUrl]) {
    return res.status(404).json({ error: 'short url not found' });
  }
  
  // Redirect to original URL
  res.redirect(urls[shortUrl]);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
