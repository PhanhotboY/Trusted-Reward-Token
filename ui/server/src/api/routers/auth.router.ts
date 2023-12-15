import express from "express";

import { adminController } from "../controllers";

const authRouter = express.Router();

// authRouter.post("/login", adminController.login);
// authRouter.post("/logout", adminController.logout);
// authRouter.post("/register", adminController.register);
// authRouter.post("/forgot-password", adminController.forgotPassword);
// authRouter.post("/reset-password", adminController.resetPassword);
// authRouter.post("/change-password", adminController.changePassword);
// authRouter.post("/refresh-token", adminController.refreshToken);

export default authRouter;
