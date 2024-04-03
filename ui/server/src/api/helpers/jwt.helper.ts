import { verify } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../core/errors";

function verifyToken<T>(token: string, publicKey: string) {
  try {
    const decoded = <T & { iat: number; exp: number, isExpired: boolean }>(
      verify(token, publicKey, { algorithms: ["RS256"], ignoreExpiration: true })
    );
    decoded.isExpired = false;

    if (!decoded) {
      throw new BadRequestError("Invalid token!");
    }
    if (decoded.exp * 1000 < Date.now()) {
      decoded.isExpired = true;
    }
    return decoded;
  }
  catch (error) {
    throw new UnauthorizedError("Invalid token!");
  }
}

export { verifyToken };
