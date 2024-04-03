import { Request, Response, NextFunction } from "express";
import { UUID } from "sequelize";

import { IUserJWTPayload } from "../interfaces/user.interface";
import { KeyTokenModel } from "../models";
import { HEADER, USER } from "../constants";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from "../core/errors";
import { verifyToken } from "../helpers/jwt.helper";
import { refreshTokenService } from "../services/auth.service";
import { findKeyTokenByUserId } from "../services/keytoken.service";

const uuidv4Regex = new RegExp(
  /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
);

function onlyAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user.role !== USER.ROLE.ADMIN) {
    throw new ForbiddenError("Permission denied!");
  }
  next();
}

function onlyAuthUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new ForbiddenError("Please login!");
  }
  next();
}

function onlyMember(req: Request, res: Response, next: NextFunction) {
  switch (req.user.role) {
    case USER.ROLE.ADMIN:
    case USER.ROLE.MEMBER:
      next();
      break;
    default:
      throw new ForbiddenError("Permission denied!");
  }
}

async function authentication(req: Request, res: Response, next: NextFunction) {
  const clientId = <string | undefined>req.headers[HEADER.CLIENT_ID];
  const refreshToken = <string | undefined>req.headers[HEADER.REFRESH_TOKEN];
  const accessToken = <string | undefined>req.headers[HEADER.AUTHORIZATION];

  if (!clientId || !uuidv4Regex.test(clientId)) {
    throw new BadRequestError("Invalid request!");
  }

  const keyToken = await findKeyTokenByUserId(<string>clientId);
  if (!keyToken) {
    throw new UnauthorizedError("Please login!");
  }

  if (accessToken) {
    const user = verifyToken<IUserJWTPayload>(
      accessToken.replace("Bearer ", ""),
      keyToken.publicKey
    );
    if (user.userId !== clientId) {
      throw new BadRequestError("Invalid token!");
    }

    req.user = user;

    if (user.isExpired && refreshToken) {
      req.refreshToken = refreshToken;
      await refreshTokenService(user, keyToken, refreshToken);
      const newKeyToken = await findKeyTokenByUserId(user.userId);
      if (!newKeyToken) throw new InternalServerError("Something went wrong. Please login again!");

      req.keyToken = newKeyToken;

      return next();
    }
  } else if (refreshToken) {
    const user = verifyToken<IUserJWTPayload>(refreshToken, keyToken.publicKey);

    if (user.userId !== clientId) {
      throw new UnauthorizedError("Invalid token!");
    }

    req.refreshToken = refreshToken;
    await refreshTokenService(user, keyToken, refreshToken);
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
