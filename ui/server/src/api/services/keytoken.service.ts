import { Op } from "sequelize";
import { KeyTokenModel } from "../models";
import { IKeyTokenCreationAttributes } from "../interfaces/keytoken.interface";

async function createKeyToken({
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

async function findKeyTokenByUserId(userId: string) {
  return KeyTokenModel.findOne({ where: { userId } });
}

async function findKeyTokenByRefreshToken(refreshToken: string) {
  return KeyTokenModel.findOne({ where: { refreshToken } });
}

async function findKeyTokenByRefreshTokenUsed(refreshTokenUsed: string) {
  return KeyTokenModel.findOne({
    where: { refreshTokensUsed: { [Op.contains]: [refreshTokenUsed] } },
  });
}

async function updateKeyToken(keyToken: KeyTokenModel, values: IKeyTokenCreationAttributes) {
  return keyToken.update(values);
}

async function updateRefreshTokensUsed(foundKeyToken: KeyTokenModel, newRefreshToken: string) {
  return foundKeyToken.update({
    refreshToken: newRefreshToken,
    refreshTokensUsed: [...foundKeyToken?.refreshTokensUsed, foundKeyToken?.refreshToken],
  });
}

async function deleteKeyTokenByUserId(userId: string) {
  return KeyTokenModel.destroy({ where: { userId } });
}

export {
  createKeyToken,
  findKeyTokenByUserId,
  findKeyTokenByRefreshToken,
  findKeyTokenByRefreshTokenUsed,
  updateRefreshTokensUsed,
  deleteKeyTokenByUserId,
};
