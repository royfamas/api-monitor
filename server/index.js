const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let endpoints = [];

// Get all endpoints
app.get('/endpoints', (req, res) => {
  res.json(endpoints);
});

// Add new endpoint
app.post('/endpoints', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  endpoints.push({ url, history: [] });

  res.json({ message: 'Endpoint added' });
});

// Monitoring loop
setInterval(async () => {
  for (let endpoint of endpoints) {
    const start = Date.now();

    try {
      await axios.get(endpoint.url);
      const responseTime = Date.now() - start;

      endpoint.history.push({
        status: 'UP',
        responseTime,
        time: new Date()
      });
    } catch (err) {
      endpoint.history.push({
        status: 'DOWN',
        responseTime: null,
        time: new Date()
      });
    }

    // keep last 20 records
    if (endpoint.history.length > 20) {
      endpoint.history.shift();
    }
  }
}, 5000);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});