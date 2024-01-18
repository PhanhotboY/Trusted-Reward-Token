import { Router } from "express";

import { balanceController } from "../controllers";

const balanceRouter = Router();

balanceRouter.get("/:userId", balanceController.getBalance);

export default balanceRouter;
