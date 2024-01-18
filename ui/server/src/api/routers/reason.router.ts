import { Router } from "express";

import { reasonController } from "../controllers";
import { authentication, onlyAdmin } from "../middlewares/auth.middleware";

const reasonRouter = Router();

reasonRouter.use(authentication, onlyAdmin);

// adminRouter.get("/admin", adminController.getAdmin);
// reasonRouter.post("/reasons", reasonController.addreason);

// reasonRouter.get("/reasons", reasonController.getreasonList);

// reasonRouter.get("/swags", reasonController.getSwagList);
// reasonRouter.post("/swags", reasonController.addSwag);

// reasonRouter.post("/issue-token", reasonController.issueToken);

export default reasonRouter;
