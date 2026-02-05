import express from "express";
import { Request, Response } from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000
const app = express();

// middleware
app.use(express.json());
app.use(cors())

//health route 
app.get("/health", (req:Request , res:Response )=>{
  return res.status(200).json({
    message: "pdf transalation api is running"
  });
});

//routes 


//server
app.listen(PORT ,()=>{
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`)
})