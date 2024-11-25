import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import { authMobileRouter } from '../routes/mobile/auth-mobile-api.js';

export const mobile = express();

mobile.use(express.json({limit: '50mb'}));
mobile.use(multer().none());
mobile.use(cors());
mobile.use('/photoProfile', express.static('photoProfile'));
mobile.use('/proofVerificationPicture', express.static('proofVerificationPicture'));
mobile.use(bodyParser.json(({limit: '30mb'})));
mobile.use(bodyParser.urlencoded({limit: '30mb', extended: true}));
mobile.use(authMobileRouter);
