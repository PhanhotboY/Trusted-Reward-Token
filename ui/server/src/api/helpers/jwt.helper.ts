import { verify } from "jsonwebtoken";
import { BadRequestError } from "../core/errors";

function verifyToken<T>(token: string, publicKey: string) {
  const decoded = <T & { iat: number; exp: number }>(
    verify(token, publicKey, { algorithms: ["RS256"], ignoreExpiration: true })
  );

  if (!decoded) {
    throw new BadRequestError("Invalid token!");
  } else if (decoded.exp * 1000 < Date.now()) {
    throw new BadRequestError("Token expired!");
  }
  return decoded;
}

export { verifyToken };
