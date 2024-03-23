import { Router } from "express";

import userRouter from "./user.router";
import swagRouter from "./swag.router";
import requestRouter from "./request.router";
import balanceRouter from "./balance.router";
import reasonRouter from "./reason.router";
import authRouter from "./auth.router";
import memberRouter from "./member.router";
import { authentication } from "../middlewares/auth.middleware";

const router = Router();
router.use("/v1/auth", authRouter);

router.use("/v1/swags", swagRouter);
router.use("/v1/users", userRouter);
router.use("/v1/reasons", reasonRouter);
router.use("/v1/requests", requestRouter);
router.use("/v1/balances", balanceRouter);
router.use("/v1/request-reasons", reasonRouter);
router.use("/v1/members", memberRouter);

export default router;
