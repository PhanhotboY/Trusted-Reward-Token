import { verify } from "jsonwebtoken";
import { BadRequestError } from "../core/errors";

function verifyToken<T>(token: string, publicKey: string) {
  try {
    return <T>verify(token, publicKey, { algorithms: ["RS256"], ignoreExpiration: true });
  } catch (err) {
    throw new BadRequestError("Invalid token!");
  }
}

export { verifyToken };
