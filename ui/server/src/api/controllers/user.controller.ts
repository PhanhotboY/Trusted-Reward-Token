import { Request, Response } from "express";

import { deleteUser, getUser, getUserDetails, updateUser } from "../services/user.service";
import { OK } from "../core/success.response";
import { getReputationBalance } from "../services/balance.service";

// userRouter.get("balance", userController.getBalance);
async function getBalance(req: Request, res: Response) {
  return OK({
    res,
    message: "Get user balance successfully!",
    metadata: await getReputationBalance(req.user.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      details: {
        href: `${process.env.API_URL}/users/me`,
        method: "GET",
      },
      others: {
        href: `${process.env.API_URL}/users/:userId`,
        method: "GET",
      },
    },
  });
}
// userRouter.get("me", userController.getEmployeeDetail);
async function getUserDetailSelf(req: Request, res: Response) {
  return OK({
    res,
    message: "Get user detail successfully!",
    metadata: await getUserDetails(req.user.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      balance: {
        href: `${process.env.API_URL}/users/balance`,
        method: "GET",
      },
      others: {
        href: `${process.env.API_URL}/users/:userId`,
        method: "GET",
      },
    },
  });
}
// userRouter.get(":userId", userController.getEmployee);
async function getEmployee(req: Request, res: Response) {
  return OK({
    res,
    message: "Get user successfully!",
    metadata: await getUser(req.params.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
    },
  });
}

// userRouter.put("me", userController.updateEmployee);
async function updateUserSelf(req: Request, res: Response) {
  return OK({
    res,
    message: "Update user successfully!",
    metadata: await updateUser(req.user.userId, req.body),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      details: {
        href: `${process.env.API_URL}/users/me`,
        method: "GET",
      },
      others: {
        href: `${process.env.API_URL}/users/:userId`,
        method: "GET",
      },
    },
  });
}
// userRouter.patch("me", userController.patchEmployee);
async function patchUser(req: Request, res: Response) {
  res.send("patchEmployee");
}

// userRouter.delete(":userId", userController.deleteEmployee);
async function deleteEmployee(req: Request, res: Response) {
  return OK({
    res,
    message: "Delete user successfully!",
    metadata: await deleteUser(req.params.userId),
    link: {
      self: {
        href: req.originalUrl,
        method: req.method,
      },
      details: {
        href: `${process.env.API_URL}/users/me`,
        method: "GET",
      },
      others: {
        href: `${process.env.API_URL}/users/:userId`,
        method: "GET",
      },
    },
  });
}

export const userController = {
  getBalance,
  getUserDetailSelf,
  getEmployee,
  updateUserSelf,
  patchUser,
  deleteEmployee,
};
