const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const RENDER_API_KEY = process.env.RENDER_API_KEY;

// ✅ הוסף את זה - נתיב ראשי
app.get('/', (req, res) => {
  res.json({
    message: 'Render Services API',
    endpoints: {
      services: '/services - Get all services'
    }
  });
});

// הנתיב הקיים
app.get('/services', async (req, res) => {
  try {
    const response = await axios.get('https://api.render.com/v1/services', {
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Accept': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch services',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
