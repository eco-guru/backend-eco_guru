import express from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/web/public-api.js";
import { userRouter } from "../routes/web/auth-api.js";
import cookieParser from "cookie-parser";
import { adminRouter } from "../routes/web/admin-api.js";
import { collectorRouter } from "../routes/web/wasteCollector-api.js";
import { educatorRouter } from "../routes/web/educator-api.js";

dotenv.config();
export const web = express.Router(); // Ubah ke Router

web.use(cookieParser());
// Hapus konfigurasi CORS di sini karena sudah di index.tsx

web.use(express.json());
web.use(publicRouter);
web.use(userRouter);
web.use(adminRouter);
web.use(educatorRouter);
web.use(collectorRouter);
web.use(errorMiddleware);