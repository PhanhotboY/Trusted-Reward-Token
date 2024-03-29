import jwt from "jsonwebtoken";
import { generateKeyPairSync } from "crypto";

import { IUserJWTPayload } from "../interfaces/user.interface";

function generateTokenPair({
  payload: { userId, email, role },
  privateKey,
  publicKey,
}: {
  payload: IUserJWTPayload;
  privateKey: string;
  publicKey: string;
}) {
  console.log("jwt payload", { userId, email, role });
  const accessToken = jwt.sign({ userId, email, role }, privateKey, {
    algorithm: "RS256",
    expiresIn: "1 days",
  });
  const refreshToken = jwt.sign({ userId, email, role }, privateKey, {
    algorithm: "RS256",
    expiresIn: "3 days",
  });

  return { accessToken, refreshToken };
}

function generateKeyPair() {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
    },
  });

  return {
    publicKey,
    privateKey,
  };
}

export { generateKeyPair, generateTokenPair };
