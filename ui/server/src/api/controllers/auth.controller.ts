import { Request, Response } from "express";
import { OK } from "../core/success.response";

async function login(req: Request, res: Response) {
  OK({
    res,
    link: { self: { href: "/api/auth/login", method: "POST" } },
    metadata: { message: "login" },
    message: "Login successfully!",
  });
}

export { login };
