import express, { Request, Response } from "express";

import { authController } from "../controllers";
import { authentication } from "../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/admin/register", authController.registerAdmin);
authRouter.post("/secretary/register", authController.registerSecretary);

authRouter.use(authentication);

// authRouter.post("/forgot-password", authController.forgotPassword);
// authRouter.post("/reset-password", authController.resetPassword);
// authRouter.post("/change-password", authController.changePassword);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);

export default authRouter;
