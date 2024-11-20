const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3001;

// Brug CORS
app.use(cors());

// Opret forbindelse til databasen
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

// API-endpoint for at hente data fra alle tre tabeller
app.get('/api/data', async (req, res) => {
  try {
    // Forespørg data fra de tre tabeller
    const areaData = await pool.query('SELECT * FROM area'); // Tabel 1
    const sunshineData = await pool.query('SELECT * FROM sunshine_hours'); // Tabel 2
    const consumptionData = await pool.query('SELECT * FROM consumption'); // Tabel 3

    // Returner alle data som et samlet objekt
    res.json({
      area: areaData.rows,
      sunshine_hours: sunshineData.rows,
      consumption: consumptionData.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start serveren
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
