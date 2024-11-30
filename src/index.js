import { web } from "./application/web.js";
import { mobile } from "./application/mobile.js";
import { logger } from "./application/logging.js";
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ['http://localhost', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.options('*', cors());

app.use(web);
app.use(mobile);

const port = process.env.PORT;

app.listen(port, () => {
    logger.info(`App start on Port ${port}`);
});