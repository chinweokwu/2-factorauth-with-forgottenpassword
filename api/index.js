import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import db from "./db.js";
import userRoutes from "./Route/userRoute.js";
import passwordReset from "./Route/forgetPasswordRoutes.js";
dotenv.config();

const app = express();
db();

app.use(express.json());
app.use(cors());

app.use(userRoutes);
app.use(passwordReset)
const port = process.env.PORT || 8080;
app.listen(port, ()=> console.log(`Listening on port ${port}...`));
