import { Router } from "express";

import { authentication, onlyAdmin, onlyMember } from "../middlewares/auth.middleware";
import { requestController } from "../controllers/request.controller";

const requestRouter = Router();

requestRouter.use(authentication);

requestRouter.get("/", onlyAdmin, requestController.getRequestList);
requestRouter.post("/:requestId", onlyAdmin, requestController.handleRequest);

requestRouter.get("/:requestId", onlyMember, requestController.getRequest);

requestRouter.post("/granting", onlyMember, requestController.requestGranting);
requestRouter.post("/transfer", onlyMember, requestController.requestTransfer);

requestRouter.delete("/:requestId", onlyMember, requestController.withdrawRequest);

export default requestRouter;
