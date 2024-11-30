import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import { errorMiddleware } from "../middleware/error-middleware.js";
import { publicRouter } from "../routes/web/public-api.js";
import { userRouter } from "../routes/web/auth-api.js";
import cookieParser from "cookie-parser";
import { adminRouter } from "../routes/web/admin-api.js";
import { collectorRouter } from "../routes/web/wasteCollector-api.js";
import { educatorRouter } from "../routes/web/educator-api.js";
import { authMobileRouter } from '../routes/mobile/auth-mobile-api.js';
import { transactionMobileRouter } from '../routes/mobile/transaction-mobile-api.js';
import { articleMobileRouter } from '../routes/mobile/article-mobile-api.js';
import { videoMobileRouter } from '../routes/mobile/video-mobile-api.js';

dotenv.config();
export const web = express.Router();

// Basic middleware
web.use(cookieParser());
web.use(express.json({ limit: '50mb' }));

// Static file serving
web.use('/storage/photoProfile', express.static('storage/photoProfile'));
web.use('/storage/proofVerificationPicture', express.static('storage/proofVerificationPicture'));

// Body parser middleware
web.use(bodyParser.json({ limit: '30mb' }));
web.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// Mobile routes
web.use(authMobileRouter);
web.use(transactionMobileRouter);
web.use(articleMobileRouter);
web.use(videoMobileRouter);

// Web routes
web.use(publicRouter);
web.use(userRouter);
web.use(adminRouter);
web.use(educatorRouter);
web.use(collectorRouter);

// Error middleware harus selalu di akhir
web.use(errorMiddleware);