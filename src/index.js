import { web } from "./application/web.js";
import { logger } from "./application/logging.js";
import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
    origin: ['http://localhost', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.options('*', cors());

app.use(web);

const port = process.env.PORT;

app.use((err, req, res, next) => {
    console.error('Uncaught error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

app.listen(port, () => {
    logger.info(`App start on Port ${port}`);
});