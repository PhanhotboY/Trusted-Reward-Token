import { IUserJWTPayload } from "../../src/api/interfaces/user.interface";
import { KeyTokenModel } from "../../src/api/models";

declare global {
  namespace Express {
    interface Request {
      user: IUserJWTPayload;
      keyToken: KeyTokenModel;
      refreshToken?: string;
    }
  }
}
