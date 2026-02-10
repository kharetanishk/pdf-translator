import { Router } from "express";
import { uploadPdfController } from "../controller/pdf.controller";
import pdfUpload from "../middleware/multer";

const pdfRouter = Router();

pdfRouter.post(
  "/upload",
  pdfUpload.single("pdfFile"),
  uploadPdfController
);

export default pdfRouter;
