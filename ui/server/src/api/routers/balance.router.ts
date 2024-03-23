import { Router } from "express";

import { balanceController } from "../controllers";

const balanceRouter = Router();

balanceRouter.get("/:userId", balanceController.getBalance);

// balanceRouter.post("/issue-token", balanceController.issueToken);
// balanceRouter.post("/renewal", balanceController.renewal);

export default balanceRouter;
