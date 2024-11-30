import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';
import { authMobileRouter } from '../routes/mobile/auth-mobile-api.js';
import { transactionMobileRouter } from '../routes/mobile/transaction-mobile-api.js';
import { articleMobileRouter } from '../routes/mobile/article-mobile-api.js';
import { videoMobileRouter } from '../routes/mobile/video-mobile-api.js';

export const mobile = express.Router(); // Ubah ke Router

mobile.use(express.json({limit: '50mb'}));
mobile.use(multer().none());

// Hapus konfigurasi CORS di sini karena sudah di index.tsx

mobile.use('/storage/photoProfile', express.static('storage/photoProfile'));
mobile.use('/storage/proofVerificationPicture', express.static('storage/proofVerificationPicture'));

mobile.use(bodyParser.json(({limit: '30mb'})));
mobile.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

mobile.use(authMobileRouter);
mobile.use(transactionMobileRouter);
mobile.use(articleMobileRouter);
mobile.use(videoMobileRouter);