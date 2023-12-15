import { Router } from "express";

import employeeRouter from "./employee.router";
import secretaryRouter from "./secretary.router";
import adminRouter from "./admin.router";

const router = Router();

router.use("/admin", adminRouter);
router.use("/secretary", secretaryRouter);
router.use("/employee", employeeRouter);

export default router;
