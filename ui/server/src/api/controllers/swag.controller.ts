import { NextFunction, Request, Response } from "express";
import { CREATED, OK } from "../core/success.response";
import { swagService } from "../services/swag.service";

const API_PATH = process.env.API_PATH;

async function getSwagList(req: Request, res: Response, next: NextFunction) {
  return OK({
    res,
    message: "Get swag list successfully!",
    metadata: await swagService.getSwagList(req.query),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      detail: {
        href: `${API_PATH}/swags/:id`,
        method: "GET",
      },
      create: {
        href: `${API_PATH}/swags`,
        method: "POST",
      },
      update: {
        href: `${API_PATH}/swags/:id`,
        method: "PUT",
      },
      delete: {
        href: `${API_PATH}/swags/:id`,
        method: "DELETE",
      },
    },
  });
}

async function getSwag(req: Request, res: Response, next: NextFunction) {
  return OK({
    res,
    message: "Get swag successfully!",
    metadata: await swagService.getSwag(req.params.swagId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/swags`,
        method: "GET",
      },
      create: {
        href: `${API_PATH}/swags`,
        method: "POST",
      },
      update: {
        href: `${API_PATH}/swags/:id`,
        method: "PUT",
      },
      delete: {
        href: `${API_PATH}/swags/:id`,
        method: "DELETE",
      },
    },
  });
}

async function createSwag(req: Request, res: Response, next: NextFunction) {
  return CREATED({
    res,
    message: "Create swag successfully!",
    metadata: await swagService.createSwag(req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/swags`,
        method: "GET",
      },
      detail: {
        href: `${API_PATH}/swags/:id`,
        method: "GET",
      },
      update: {
        href: `${API_PATH}/swags/:id`,
        method: "PUT",
      },
      delete: {
        href: `${API_PATH}/swags/:id`,
        method: "DELETE",
      },
    },
  });
}

async function redeemSwag(req: Request, res: Response, next: NextFunction) {
  return OK({
    res,
    message: "Redeem swag successfully!",
    metadata: await swagService.redeemSwag(req.user.userId, req.params.swagId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/swags`,
        method: "GET",
      },
      detail: {
        href: `${API_PATH}/swags/:id`,
        method: "GET",
      },
      create: {
        href: `${API_PATH}/swags`,
        method: "POST",
      },
      update: {
        href: `${API_PATH}/swags/:id`,
        method: "PUT",
      },
      delete: {
        href: `${API_PATH}/swags/:id`,
        method: "DELETE",
      },
    },
  });
}

async function updateSwag(req: Request, res: Response, next: NextFunction) {
  return OK({
    res,
    message: "Update swag successfully!",
    metadata: await swagService.updateSwag(req.params.id, req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/swags`,
        method: "GET",
      },
      detail: {
        href: `${API_PATH}/swags/:id`,
        method: "GET",
      },
      create: {
        href: `${API_PATH}/swags`,
        method: "POST",
      },
      delete: {
        href: `${API_PATH}/swags/:id`,
        method: "DELETE",
      },
    },
  });
}

async function deleteSwag(req: Request, res: Response, next: NextFunction) {
  return OK({
    res,
    message: "Delete swag successfully!",
    metadata: await swagService.deleteSwag(req.params.swagId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      list: {
        href: `${API_PATH}/swags`,
        method: "GET",
      },
      detail: {
        href: `${API_PATH}/swags/:id`,
        method: "GET",
      },
      create: {
        href: `${API_PATH}/swags`,
        method: "POST",
      },
      update: {
        href: `${API_PATH}/swags/:id`,
        method: "PUT",
      },
    },
  });
}

export const swagController = {
  getSwagList,
  getSwag,
  createSwag,
  redeemSwag,
  updateSwag,
  deleteSwag,
};
