import { web } from "./application/web.js";
import { mobile } from "./application/mobile.js";
import { logger } from "./application/logging.js";
import express from 'express';

const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(mobile);
app.use(web);

const port = process.env.PORT;

app.listen(port, () => {
  logger.info(`App start on Port ${port}`);
});
