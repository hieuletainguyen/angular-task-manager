import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express"

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



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


export default app;
