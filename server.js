import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'semesterprojekt')));

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: process.env.PG_REQUIRE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

app.get('/api/data', async (req, res) => {
    try {
      const areaResult = await pool.query('SELECT country, area FROM area');
      const sunshineResult = await pool.query('SELECT country, year FROM sunshine_hours');
      const consumptionResult = await pool.query('SELECT country, consumption_twh FROM consumption');
  
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});