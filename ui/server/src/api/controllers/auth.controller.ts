import { Request, Response } from "express";

import { loginService, logoutService, registerService } from "../services/auth.service";
import { OK } from "../core/success.response";

async function login(req: Request, res: Response) {
  return OK({
    res,
    link: { self: { href: "/api/auth/login", method: "POST" } },
    metadata: await loginService({ ...req.body, refreshToken: req.refreshToken }),
    message: "Login successfully!",
  });
}

async function register(req: Request, res: Response) {
  return OK({
    res,
    link: { self: { href: "/api/auth/register", method: "POST" } },
    metadata: await registerService(req.body),
    message: "Register successfully!",
  });
}

async function logout(req: Request, res: Response) {
  return OK({
    res,
    link: { self: { href: "/api/auth/logout", method: "POST" } },
    metadata: await logoutService(req.user.userId),
    message: "logout successfully!",
  });
}

async function refreshToken(req: Request, res: Response) {
  return OK({
    res,
    link: { self: { href: "/api/auth/refresh-token", method: "POST" } },
    metadata: {},
    message: "Refresh token successfully!",
  });
}

export { logout, login, register, refreshToken };
