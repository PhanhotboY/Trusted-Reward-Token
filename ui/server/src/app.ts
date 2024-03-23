import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";

import "express-async-errors";
require("dotenv").config({ path: ".env.server" });

import router from "./api/routers";
import { notFoundHandler, errorHandler } from "./api/middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan("dev"));

app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
