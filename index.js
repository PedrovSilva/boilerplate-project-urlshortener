const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));
// In-memory storage for URLs
const urls = {};
let counter = 0;

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// Endpoint to create short URL
app.post('/api/shorturl', function(req, res) {
  const originalUrl = req.body.url;
  
  // Validate URL format
  const urlRegex = /^https?:\/\/www\..+/;
  if (!urlRegex.test(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }
  
  // Generate short URL
  const shortUrl = counter++;
  urls[shortUrl] = originalUrl;
  
  // Send JSON response with short URL
  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// Endpoint to redirect short URL to original URL
app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = req.params.shortUrl;
  
  // Check if short URL exists in database
  if (!urls.hasOwnProperty(shortUrl)) {
    return res.json({ error: 'short url not found' });
  }
  
  // Redirect to original URL
  res.redirect(urls[shortUrl]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
