import jwt from "jsonwebtoken";
import { generateKeyPairSync } from "crypto";

async function generateTokenPair({
  payload,
  privateKey,
  publicKey,
}: {
  payload: any;
  privateKey: string;
  publicKey: string;
}) {
  const accessToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "2 days",
  });
  const refreshToken = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7 days",
  });

  return { accessToken, refreshToken };
}

async function generateKeyPair() {
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
