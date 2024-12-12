// Her hentes node modulerne
import pg from 'pg';
import dotenv from 'dotenv';
import { pipeline } from 'node:stream/promises';
import fs from 'node:fs';
import { from as copyFrom } from 'pg-copy-streams';

// Her oprettes forbindelse til vores database gennem vores .env fil
dotenv.config();
console.log('Connecting to database', process.env.PG_DATABASE);
const db = new pg.Pool({
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT),
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    ssl: process.env.PG_REQUIRE_SSL === 'true' ? {
        rejectUnauthorized: false,
    } : undefined,
});

/* Herunder begynder vi at lave selve databasen.
Dette gør vi ved at lave en sql querry som vi plejer i pgAdmin.
Vi starter med drop table i tilfælde af at noget har skulle ændres.
Derefter laver vi fire tabeller. */
try {
    const dbResult = await db.query('SELECT NOW()');
    console.log('Database connection established on', dbResult.rows[0].now);

    console.log('Recreating tables...');
    await db.query(`
        DROP TABLE IF EXISTS area;
        DROP TABLE IF EXISTS consumption;
        DROP TABLE IF EXISTS sunshine_hours;
        DROP TABLE IF EXISTS gross_data;

        CREATE TABLE area (
country VARCHAR(100) PRIMARY KEY,
code VARCHAR(5),
year INTEGER,
area INTEGER,
time INTEGER
);

CREATE TABLE consumption (
country VARCHAR(100),
code VARCHAR(5),
year INTEGER,
consumption_twh NUMERIC(20, 2),
time INTEGER
);

CREATE TABLE sunshine_hours (
country VARCHAR(100),
city VARCHAR(100),
jan NUMERIC(10, 2),
feb NUMERIC(10, 2),
mar NUMERIC(10, 2),
apr NUMERIC(10, 2),
may NUMERIC(10, 2),
jun NUMERIC(10, 2),
jul NUMERIC(10, 2),
aug NUMERIC(10, 2),
sep NUMERIC(10, 2),
oct NUMERIC(10, 2),
nov NUMERIC(10, 2),
dec NUMERIC(10, 2),
year NUMERIC(10, 2)
);

CREATE TABLE gross_data (
country VARCHAR (100),
area decimal (10, 2),
sunshine_hours decimal (10, 2),
consumption_twh decimal (10, 2),
avg_land_i_procent decimal (10, 2),
land_km2 decimal (10, 2)
);
    `);

    console.log('Tables recreated.'); // Console logger at databasen er oprettet

/* Herunder henter vi dataen ind i tabellerne fra vores csv filer.
Igen gør vi som var det i pgAdmin og husker at skrive om det er med header, hvilke titler kolonnerne har osv.
Så slutter vi med at give den en relative path til csv filerne. */
    console.log('Copying data from CSV files...');
    await copyIntoTable(db, `
        COPY area (country, code, year, area, time)
        FROM STDIN
        WITH CSV HEADER
    `, 'db/landmasse.csv');
    await copyIntoTable(db, `
        COPY consumption (country, code, year, consumption_twh, time)
        FROM STDIN
        WITH CSV HEADER
    `, 'db/energiforbrug_alle_lande.csv');
    await copyIntoTable(db, `
        COPY sunshine_hours (country, city, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec, year)
        FROM STDIN
        WITH CSV HEADER
    `, 'db/solskinstimer.csv');
    await copyIntoTable(db, `
        COPY gross_data (country, area, sunshine_hours, consumption_twh, avg_land_i_procent, land_km2)
        FROM STDIN
        WITH CSV HEADER
    `, 'db/samlet_data.csv');

// Hernede får vi logget i konsollen hvordan det er gået med at hente dataen.
    console.log('Data copied.');
} catch (err) {
    console.error('Error during database setup:', err);
} finally {
    await db.end();
    console.log('Database connection closed.');
}
/* Herunder definerer vi en asynkron function der henter data ind i vores tabeller.
Dette optimerer hastigheden ved at hente data ind i chunks i stedet for det hele på en gang */
async function copyIntoTable(db, sql, file) {
    const client = await db.connect();
    try {
        const ingestStream = client.query(copyFrom(sql));
        const sourceStream = fs.createReadStream(file);
        await pipeline(sourceStream, ingestStream);
    } finally {
        client.release();
    }
}