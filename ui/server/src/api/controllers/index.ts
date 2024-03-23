import { IUserJWTPayload } from "../interfaces/user.interface";
import { KeyTokenModel } from "../models";

declare global {
  namespace Express {
    interface Request {
      user: IUserJWTPayload;
      keyToken: KeyTokenModel;
      refreshToken?: string;
    }
  }
}

export * from "./auth.controller";
export * from "./balance.controller";
export * from "./swag.controller";
export * from "./request.controller";
export * from "./reason.controller";
export * from "./user.controller";
export * from "./member.controller";
