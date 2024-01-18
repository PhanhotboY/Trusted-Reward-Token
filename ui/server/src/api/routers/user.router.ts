import { Router } from "express";

import { userController } from "../controllers";
import {
  authentication,
  onlyAdmin,
  onlyAuthUser,
  onlyOrganization,
} from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.use(authentication);
// onlyOrgMember, onlyMe, anyLoggedInUser, onlyMember, onlyEmployee, onlyAdmin

// Employee Routes
userRouter.get("/balance", userController.getBalance);
userRouter.get("/me", onlyAuthUser, userController.getEmployeeDetail);
userRouter.get("/:userId", userController.getEmployee);

userRouter.put("/me", onlyAuthUser, userController.updateEmployee);
userRouter.patch("/me", onlyAuthUser, userController.patchEmployee);

// Secretary Routes

// Admin Routes
userRouter.delete("/:userId", onlyAdmin, userController.deleteEmployee);

export default userRouter;
