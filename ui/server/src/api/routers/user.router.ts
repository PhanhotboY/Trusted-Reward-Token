import { Router } from "express";

import { userController } from "../controllers";
import { authentication, onlyAdmin, onlyAuthUser } from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.use(authentication);
// onlyOrgMember, onlyMe, anyLoggedInUser, onlyMember, onlyEmployee, onlyAdmin

// Employee Routes
userRouter.get("/me", onlyAuthUser, userController.getUserDetailSelf);
userRouter.get("/balance", userController.getBalance);
userRouter.get("/:userId", userController.getEmployee);

userRouter.put("/me", onlyAuthUser, userController.updateUserSelf);
userRouter.patch("/me", onlyAuthUser, userController.patchUser);

// Admin Routes
userRouter.delete("/:userId", onlyAdmin, userController.deleteEmployee);

export default userRouter;
