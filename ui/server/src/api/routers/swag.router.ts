import { Router } from "express";

import { swagController } from "../controllers";
import {
  authentication,
  onlyAdmin,
  onlyAuthUser,
  onlyMember,
} from "../middlewares/auth.middleware";

const swagRouter = Router();

swagRouter.use(authentication);

swagRouter.get("/", onlyAuthUser, swagController.getSwagList);
swagRouter.get("/:swagId", onlyAuthUser, swagController.getSwag);

swagRouter.post("/:swagId", onlyMember, swagController.redeemSwag);

swagRouter.post("/", onlyAdmin, swagController.createSwag);
swagRouter.put("/:swagId", onlyAdmin, swagController.updateSwag);
swagRouter.delete("/:swagId", onlyAdmin, swagController.deleteSwag);

export default swagRouter;
