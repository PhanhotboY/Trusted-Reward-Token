import { Request, Response, NextFunction } from "express";

import { IUserJWTPayload } from "../interfaces/user.interface";
import { KeyTokenModel } from "../models";
import { HEADER, ROLE } from "../constants";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "../core/errors";
import { verifyToken } from "../helpers/jwt.helper";
import { refreshTokenService } from "../services/auth.service";
import { findKeyTokenByUserId } from "../services/keytoken.service";

declare global {
  namespace Express {
    interface Request {
      user: IUserJWTPayload;
      keyToken: KeyTokenModel;
      refreshToken?: string;
    }
  }
}

async function onlyAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user.role !== ROLE.ADMIN) {
    throw new ForbiddenError("Permission denied!");
  }
  next();
}

async function onlyAuthUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new ForbiddenError("Please login!");
  }
  next();
}

async function onlyMember(req: Request, res: Response, next: NextFunction) {
  if (req.user.role !== ROLE.MEMBER) {
    throw new ForbiddenError("Permission denied!");
  }
  next();
}

async function authentication(req: Request, res: Response, next: NextFunction) {
  const clientId = req.headers[HEADER.CLIENT_ID];
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!clientId) {
    throw new BadRequestError("Invalid request!");
  }

  const keyToken = await findKeyTokenByUserId(<string>clientId);
  if (!keyToken) {
    throw new UnauthorizedError("Please login!");
  }

  if (accessToken) {
    const user = verifyToken<IUserJWTPayload>(<string>accessToken, keyToken.publicKey);

    if (user.userId !== clientId) {
      throw new BadRequestError("Invalid token!");
    }

    req.user = user;
  } else if (refreshToken) {
    const user = verifyToken<IUserJWTPayload>(<string>refreshToken, keyToken.publicKey);

    if (user.userId !== clientId) {
      throw new BadRequestError("Invalid token!");
    }

    req.refreshToken = <string>refreshToken;
    await refreshTokenService(user, keyToken, <string>refreshToken);
    const newKeyToken = await findKeyTokenByUserId(user.userId);
    if (!newKeyToken) throw new InternalServerError("Something went wrong. Please login again!");

    req.user = user;
    req.keyToken = newKeyToken;

    return next();
  } else throw new UnauthorizedError("Please login!");

  req.keyToken = keyToken;

  next();
}

export { onlyAdmin, onlyAuthUser, onlyMember, authentication };
