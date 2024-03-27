import { Request, Response } from "express";

import { OK } from "../core/success.response";
import { RequestService } from "../services";

const API_PATH = process.env.API_PATH || "/api/v1";

async function getRequestList(req: Request, res: Response) {
  return OK({
    res,
    message: "Get request list successfully!",
    metadata: await RequestService.getRequestList(req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/requests/:id`,
        method: "GET",
      },
    },
  });
}

async function getRequest(req: Request, res: Response) {
  return OK({
    res,
    message: "Get request successfully!",
    metadata: await RequestService.getRequest({ id: req.params.requestId, ...req.query }),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/requests`,
        method: "GET",
      },
    },
  });
}

async function handleRequest(req: Request, res: Response) {
  return OK({
    res,
    message: "Handle request successfully!",
    metadata: await RequestService.requestHandler({ requestId: req.params.requestId, ...req.body }),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
    },
  });
}

// memberRouter.post("members/granting", memberController.requestGranting);
async function requestGranting(req: Request, res: Response) {
  res.send("requestGranting");
}

// memberRouter.post("members/transfer", memberController.requestTransfer);
async function requestTransfer(req: Request, res: Response) {
  res.send("requestTransfer");
}

async function withdrawRequest(req: Request, res: Response) {
  return OK({
    res,
    message: "Withdraw request successfully!",
    metadata: await RequestService.withdrawRequest(req.params.requestId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/requests`,
        method: "GET",
      },
    },
  });
}

export const requestController = {
  getRequestList,
  getRequest,
  handleRequest,
  requestGranting,
  requestTransfer,
  withdrawRequest,
};
