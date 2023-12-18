import { Router } from "express";

import employeeRouter from "./employee.router";
import secretaryRouter from "./secretary.router";
import adminRouter from "./admin.router";
import authRouter from "./auth.router";

const router = Router();

router.use("/auth", authRouter);

router.use("/admin", adminRouter);
router.use("/member", secretaryRouter);
router.use("/employee", employeeRouter);

export default router;
