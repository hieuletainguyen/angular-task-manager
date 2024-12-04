import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import pool from "./database/postgresql-config.js";

const app = express();
const port = 9897;

var corsOptions = {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true,
  optionsSuccessStatus: 204
}

app.use(express.json())
app.use(cors(corsOptions));
app.use(cookieParser());

const createTableIfNotExists = async() => {
  const client = await pool.connect();

  try {
    const query = `
      CREATE TABLE IF NOT EXISTS account (
        id SERIAL PRIMARY KEY, 
        username VARCHAR(50) NOT NULL, 
        email VARCHAR(50) NOT NULL, 
        password VARCHAR(150) NOT NULL, 
        permission VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY, 
        title VARCHAR(150) NOT NULL, 
        description VARCHAR(150) NOT NULL,
        isCompleted BOOLEAN NOT NULL,
        priority VARCHAR(50) NOT NULL,
        dueDate DATE NOT NULL,
        userId INTEGER, 
        FOREIGN KEY (userId) REFERENCES account(id) ON DELETE CASCADE
      );
    `;

    await client.query(query);
    console.log('Table created or already exists');
  } catch (err) {
    console.error('Error creating table: ', err)
  } finally {
    client.release();
  };
}

createTableIfNotExists().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})


export default app;
