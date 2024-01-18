import { Request, Response } from "express";

import {
  loginService,
  logoutService,
  registerService,
  refreshTokenService,
} from "../services/auth.service";
import { OK } from "../core/success.response";
import { USER } from "../constants";
import { ZeroAddress } from "ethers";

const API_PATH = process.env.API_PATH;

async function login(req: Request, res: Response) {
  return OK({
    res,
    metadata: await loginService({ ...req.body, refreshToken: req.refreshToken }),
    link: {
      self: { href: req.originalUrl, method: "POST" },
      logout: {
        href: `${API_PATH}/auth/logout`,
        method: "POST",
      },
    },
    message: "Login successfully!",
  });
}

async function register(req: Request, res: Response) {
  return OK({
    res,
    metadata: await registerService(req.body),
    link: {
      self: { href: req.originalUrl, method: "POST" },
      login: {
        href: `${API_PATH}/auth/login`,
        method: "POST",
      },
      logout: {
        href: `${API_PATH}/auth/logout`,
        method: "POST",
      },
    },
    message: "Register successfully!",
  });
}

async function registerAdmin(req: Request, res: Response) {
  return OK({
    res,
    metadata: await registerService({ ...req.body, address: ZeroAddress }, USER.ROLE.ADMIN),
    link: {
      self: { href: req.originalUrl, method: "POST" },
      login: {
        href: `${API_PATH}/auth/login`,
        method: "POST",
      },
      logout: {
        href: `${API_PATH}/auth/logout`,
        method: "POST",
      },
    },
    message: "Register successfully!",
  });
}

async function registerSecretary(req: Request, res: Response) {
  return OK({
    res,
    metadata: await registerService(
      {
        ...req.body,
        address: ZeroAddress,
      },
      USER.ROLE.SECRETARY
    ),
    link: {
      self: { href: req.originalUrl, method: "POST" },
      login: {
        href: `${API_PATH}/auth/login`,
        method: "POST",
      },
      logout: {
        href: `${API_PATH}/auth/logout`,
        method: "POST",
      },
    },
    message: "Register successfully!",
  });
}

async function logout(req: Request, res: Response) {
  return OK({
    res,
    metadata: await logoutService(req.user.userId),
    link: {
      self: { href: req.originalUrl, method: "POST" },
      login: {
        href: `${API_PATH}/auth/login`,
        method: "POST",
      },
    },
    message: "logout successfully!",
  });
}

async function refreshToken(req: Request, res: Response) {
  return OK({
    res,
    link: { self: { href: "/api/auth/refresh-token", method: "POST" } },
    metadata: await refreshTokenService(req.user, req.keyToken, req.refreshToken!),
    message: "Refresh token successfully!",
  });
}

export const authController = {
  logout,
  login,
  register,
  refreshToken,
  registerAdmin,
  registerSecretary,
};
