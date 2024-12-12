import dotenv from 'dotenv'; // Her henter vi data fra vores .env fil
dotenv.config();

import express from 'express'; // Her hentes vores nodemodules
import pkg from 'pg';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;

const app = express(); // Laver en express server som kører på port 3000
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'semesterprojekt')));

const pool = new Pool({ //Laver en forbindelse til vores database
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
  ssl: process.env.PG_REQUIRE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

/* Herunder fortæller vi hvilken data der skal hentes fra vores tabeller.
Derefter sørger vi for at det bliver sendt som json.
Så laver vi en consol log der fortæller hvis der utænkeligt skulle ske en fejl */
app.get('/api/data', async (req, res) => {
    try {
      const areaResult = await pool.query('SELECT country, area FROM area');
      const sunshineResult = await pool.query('SELECT country, year FROM sunshine_hours');
      const consumptionResult = await pool.query('SELECT country, consumption_twh FROM consumption');
      const grossResult = await pool.query('SELECT * FROM gross_data');
  
      res.json({
        area: areaResult.rows,
        sunshine_hours: sunshineResult.rows,
        consumption: consumptionResult.rows,
        gross_data: grossResult.rows,
      });
    } catch (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send({
        error: 'Error fetching data from database',
        details: error.message,
      });
    }
  });

// Her hentes data til vores barchart inde på statistik siden, på samme måde som før
  app.get('/api/barchart-data', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT c.country, c.consumption_twh
        FROM consumption c
        ORDER BY c.consumption_twh DESC
        LIMIT 30
      `);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
      res.status(500).send({
        error: 'Error fetching bar chart data',
        details: error.message,
      });
    }
  });

/* Her hentes yderligere data, hvor vi i vores sql querry har udeladt tre lande, for at overskueliggøre vores barchart, da disse lande
har kræver op mod 800% af deres land dækket i solceller */

  app.get('/api/barchart-land-data', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT country, avg_land_i_procent
        FROM gross_data
        WHERE country NOT IN ('Singapore', 'Bahrain', 'Malta')
        ORDER BY avg_land_i_procent DESC
        LIMIT 30
      `);

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching land percentage data:', error);
      res.status(500).send({
        error: 'Error fetching land percentage data',
        details: error.message,
      });
    }
  });

// Her starter vi serveren så alt vores data kan blive vist
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});