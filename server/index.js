import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import pool from "./database/postgresql-config.js";
import task_route from "./routes/task_route.js";
import user_route from "./routes/user_route.js";
import admin_route from "./routes/admin_route.js"
import configService from "./helper/config.service.js";
import swaggerSpec from "./swagger.js";
import swaggerUI from 'swagger-ui-express';

const app = express();
const port = 9897;

var corsOptions = {
  origin: configService.get('NODE_ENV') === 'production' 
   ? configService.get('PROD_FRONTEND_URL')
   : configService.get('FRONTEND_URL'),
  // origin: "*",
  credentials: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization']
}


app.use(express.json())
app.use(cors(corsOptions));
app.options('*', cors(corsOptions))
app.use(cookieParser());
app.use(task_route);
app.use(user_route);
app.use(admin_route);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

const createTableIfNotExists = async() => {
  const client = await pool.connect();
  if (!client) {
    console.log("not connecting to the cloud database")
  }

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
        "isCompleted" BOOLEAN NOT NULL,
        priority VARCHAR(50) NOT NULL,
        "dueDate" DATE NOT NULL,
        "userId" INTEGER, 
        FOREIGN KEY ("userId") REFERENCES account(id) ON DELETE CASCADE
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

app.get('/', (req, res) => {
  res.status(200).json('The server is working well');
})
 

export default app;
