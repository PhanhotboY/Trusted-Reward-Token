import { KeyTokenModel } from "../models";

async function createKeyToken({
  userId,
  privateKey,
  publicKey,
  refreshToken,
  refreshTokensUsed = [],
}: {
  userId: string;
  privateKey: string;
  publicKey: string;
  refreshToken: string;
  refreshTokensUsed: string[];
}) {
  return KeyTokenModel.create({
    userId,
    privateKey,
    publicKey,
    refreshToken,
    refreshTokensUsed,
  });
}

export { createKeyToken };
