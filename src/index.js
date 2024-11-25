import { web } from "./application/web.js";
import { mobile } from "./application/mobile.js";
import { logger } from "./application/logging.js";
import express from 'express';

const app = express();
app.use(mobile);
app.use(web);

const port = process.env.PORT;

app.listen(port, () => {
  logger.info(`App start on Port ${port}`);
});
