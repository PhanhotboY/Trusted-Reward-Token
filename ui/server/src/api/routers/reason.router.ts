import { Router } from "express";

import { reasonController } from "../controllers";
import {
  authentication,
  onlyAdmin,
  onlyAuthUser,
  onlyMember,
} from "../middlewares/auth.middleware";

const reasonRouter = Router();

reasonRouter.use(authentication);

reasonRouter.get("/:reasonId", onlyAuthUser, reasonController.getReason);
reasonRouter.get("/", onlyAuthUser, reasonController.getReasonList);

// Member routes
reasonRouter.post("/:reasonId", onlyMember, reasonController.commitReason);
reasonRouter.post("/:reasonId/subscribe", onlyMember, reasonController.subscribeReason);
reasonRouter.post("/:reasonId/unsubscribe", onlyMember, reasonController.unsubscribeReason);

// Admin routes
reasonRouter.post("/", onlyAdmin, reasonController.createReason);
reasonRouter.put("/:reasonId", onlyAdmin, reasonController.updateReason);
reasonRouter.delete("/:reasonId", onlyAdmin, reasonController.deleteReason);

export default reasonRouter;
