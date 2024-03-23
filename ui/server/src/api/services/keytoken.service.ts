import { Op } from "sequelize";
import { KeyTokenModel } from "../models";
import { IKeyTokenCreationAttributes } from "../interfaces/keytoken.interface";

export async function createKeyToken({
  userId,
  privateKey,
  publicKey,
  refreshToken,
  refreshTokensUsed = [],
}: IKeyTokenCreationAttributes) {
  const foundKeyToken = await findKeyTokenByUserId(userId!);

  if (foundKeyToken) {
    return updateKeyToken(foundKeyToken, {
      privateKey,
      publicKey,
      refreshToken,
      refreshTokensUsed: [...foundKeyToken.refreshTokensUsed, ...refreshTokensUsed],
    });
  }

  return KeyTokenModel.create({
    userId,
    privateKey,
    publicKey,
    refreshToken,
    refreshTokensUsed,
  });
}

export async function findKeyTokenByUserId(userId: string) {
  return KeyTokenModel.findOne({ where: { userId } });
}

export async function findKeyTokenByRefreshToken(refreshToken: string) {
  return KeyTokenModel.findOne({ where: { refreshToken } });
}

export async function findKeyTokenByRefreshTokenUsed(refreshTokenUsed: string) {
  return KeyTokenModel.findOne({
    where: { refreshTokensUsed: { [Op.contains]: [refreshTokenUsed] } },
  });
}

export async function updateKeyToken(keyToken: KeyTokenModel, values: IKeyTokenCreationAttributes) {
  return keyToken.update(values);
}

export async function updateRefreshTokensUsed(
  foundKeyToken: KeyTokenModel,
  newRefreshToken: string
) {
  return foundKeyToken.update({
    refreshToken: newRefreshToken,
    refreshTokensUsed: [...foundKeyToken?.refreshTokensUsed, foundKeyToken?.refreshToken],
  });
}

export async function deleteKeyTokenByUserId(userId: string) {
  return KeyTokenModel.destroy({ where: { userId } });
}

export const KeyTokenService = {
  createKeyToken,
  findKeyTokenByUserId,
  findKeyTokenByRefreshToken,
  findKeyTokenByRefreshTokenUsed,
  updateRefreshTokensUsed,
  deleteKeyTokenByUserId,
};
