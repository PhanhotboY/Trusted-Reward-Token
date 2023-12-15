import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

require("dotenv").config({ path: ".env.server" });

import router from "./api/routers";
import { notFoundHandler, errorHandler } from "./api/middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
