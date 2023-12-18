import { Router } from "express";

import { adminController } from "../controllers";
import { authentication, onlyAdmin } from "../middlewares/auth.middleware";

const adminRouter = Router();

adminRouter.use(authentication, onlyAdmin);

// adminRouter.get("/admin", adminController.getAdmin);

export default adminRouter;
