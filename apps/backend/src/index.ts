import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pdfRouter from "./routes/pdf.routes";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
console.log("PORT:", PORT);

const app = express();

app.use(cors());
app.use(express.json());

// health route
app.get("/api/pdf/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "pdf translation api is running",
    service: "pdf translation api",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// pdf routes
app.use("/api/pdf", pdfRouter);

//server
app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
