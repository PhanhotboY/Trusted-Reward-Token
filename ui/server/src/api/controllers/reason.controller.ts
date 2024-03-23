import { Request, Response } from "express";

import { OK, CREATED } from "../core/success.response";
import { ReasonService } from "../services/reason.service";

const API_PATH = process.env.API_PATH || "/api/v1";

const getReasonList = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason list retrieved successfully.",
    metadata: await ReasonService.getReasonList(),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "GET",
      },
      create: {
        href: `${API_PATH}/reasons`,
        method: "POST",
      },
    },
  });
};

// reasonRouter.get("/:reasonId", reasonController.getReason);
const getReason = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason retrieved successfully.",
    metadata: await ReasonService.getReasonById(req.params.reasonId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      subscribe: {
        href: `${API_PATH}/reasons/:reasonId/subscribe`,
        method: "POST",
      },
      unsubscribe: {
        href: `${API_PATH}/reasons/:reasonId/unsubscribe`,
        method: "POST",
      },
      update: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "PUT",
      },
      delete: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "DELETE",
      },
    },
  });
};

// reasonRouter.post("/", reasonController.createReason);
const createReason = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason created successfully.",
    metadata: await ReasonService.createReason(req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "GET",
      },
    },
  });
};

// reasonRouter.post("/:reasonId", reasonController.commitReason);
const commitReason = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason committed successfully.",
    metadata: await ReasonService.commitReason(
      req.user.userId,
      req.params.reasonId,
      req.body.message
    ),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "GET",
      },
    },
  });
};

// reasonRouter.post("/:reasonId/subscribe", reasonController.subscribeReason);
const subscribeReason = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason subscribed successfully.",
    metadata: await ReasonService.subscribeReason(req.user.userId, req.params.reasonId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "GET",
      },
    },
  });
};

// reasonRouter.post("/:reasonId/unsubscribe", reasonController.unsubscribeReason);
const unsubscribeReason = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason unsubscribed successfully.",
    metadata: await ReasonService.unsubscribeReason(req.user.userId, req.params.reasonId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "GET",
      },
    },
  });
};

// reasonRouter.put("/:reasonId", reasonController.updateReason);
const updateReason = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason updated successfully.",
    metadata: "not implemented", //await ReasonService.updateReason(req.params.reasonId, req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/reasons/:reasonId`,
        method: "GET",
      },
    },
  });
};

// reasonRouter.delete("/:reasonId", reasonController.deleteReason);
const deleteReason = async (req: Request, res: Response) => {
  return OK({
    res,
    message: "Reason deleted successfully.",
    metadata: await ReasonService.deleteReason(req.params.reasonId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      create: {
        href: `${API_PATH}/reasons`,
        method: "POST",
      },
    },
  });
};

export const reasonController = {
  getReasonList,
  getReason,
  createReason,
  commitReason,
  subscribeReason,
  unsubscribeReason,
  updateReason,
  deleteReason,
};
