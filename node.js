const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3001;

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
});

// API route
app.get('/api/data', async (req, res) => {
  try {
    const areaResult = await pool.query('SELECT country, area FROM area');
    const sunshineResult = await pool.query('SELECT country, year FROM sunshine_hours'); // Opdateret fra hours til year
    const consumptionResult = await pool.query('SELECT country, consumption FROM consumption');

    res.json({
      area: areaResult.rows,
      sunshine_hours: sunshineResult.rows,
      consumption: consumptionResult.rows,
    });
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).send({
      error: 'Error fetching data from database',
      details: error.message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
