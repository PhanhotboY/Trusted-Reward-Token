import { Router } from "express";

import {
  authentication,
  onlyAdmin,
  onlyAuthUser,
  onlyMember,
} from "../middlewares/auth.middleware";
import { memberController } from "../controllers";

const memberRouter = Router();

memberRouter.use(authentication);

memberRouter.get("/me", onlyMember, memberController.getMemberDetail);
memberRouter.get("/me/requests", onlyMember, memberController.getRequestList);
memberRouter.get("/me/subscriptions", onlyMember, memberController.getSubsribedReasonList);
memberRouter.get("/me/employees", onlyMember, memberController.getEmployeeList);
memberRouter.post("/me/employees", onlyMember, memberController.registerEmployee);

memberRouter.put("/me", onlyMember, memberController.updateMember);

memberRouter.delete("/me/employees/:empId", onlyMember, memberController.removeEmployee);

// User routes
memberRouter.get("/:memberId/employees", onlyAuthUser, memberController.getEmployeeListOfMember);
memberRouter.get("/:memberId", onlyAuthUser, memberController.getMember);
memberRouter.get("/", onlyAuthUser, memberController.getMemberList);

// Admin routes
memberRouter.post("/", onlyAdmin, memberController.registerMember);
memberRouter.delete("/:memberId", onlyAdmin, memberController.deleteMember);
memberRouter.get("/:memberId/requests", onlyAdmin, memberController.getRequestListOfMember);

export default memberRouter;
