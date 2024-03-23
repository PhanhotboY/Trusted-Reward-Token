import { Request, Response } from "express";

import { OK } from "../core/success.response";
import { getReputationBalance } from "../services/balance.service";

async function getBalance(req: Request, res: Response) {
  return OK({
    res,
    message: "Balance retrieved successfully",
    metadata: await getReputationBalance(req.params.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
    },
  });
}

async function renewal(req: Request, res: Response) {
  return OK({
    res,
    message: "Balance renewed successfully",
    metadata: await getReputationBalance(req.params.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: "POST",
      },
    },
  });
}

export const balanceController = {
  getBalance,
};
