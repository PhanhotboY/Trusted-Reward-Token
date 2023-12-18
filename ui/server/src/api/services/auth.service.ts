import bcrypt from "bcrypt";

import { createUser, findUserByEmail, findUserByOptionalAttributes } from "./user.service";
import { BadRequestError, ForbiddenError, InternalServerError } from "../core/errors";
import { generateKeyPair, generateTokenPair } from "../utils/keytoken";
import {
  createKeyToken,
  deleteKeyTokenByUserId,
  updateRefreshTokensUsed,
} from "./keytoken.service";
import {
  IUserAttributes,
  IUserCreationAttributes,
  IUserJWTPayload,
} from "../interfaces/user.interface";
import { getReturnData } from "../utils";
import { ROLE } from "../constants";
import { getAddress } from "ethers";
import { KeyTokenModel, UserModel } from "../models";

const userReturnFields: Array<keyof IUserAttributes> = [
  "id",
  "username",
  "firstName",
  "lastName",
  "address",
  "email",
  "orgId",
];

async function loginService({
  email,
  username,
  password,
  refreshToken,
}: {
  email?: string;
  username?: string;
  password: string;
  refreshToken?: string;
}) {
  const foundUser = await findUserByOptionalAttributes({ email, username });

  if (!foundUser) {
    throw new BadRequestError("Not registered!");
  }

  const isMatchPwd = bcrypt.compareSync(password, foundUser.password);

  if (!isMatchPwd) {
    throw new BadRequestError("Authentication Failed!");
  }

  const { privateKey, publicKey } = generateKeyPair();
  const tokens = generateTokenPair({
    payload: { ...foundUser, userId: foundUser.id },
    privateKey,
    publicKey,
  });

  await createKeyToken({
    userId: foundUser.id,
    refreshToken: tokens.refreshToken,
    publicKey,
    privateKey,
    refreshTokensUsed: refreshToken ? [refreshToken] : [],
  });

  return { user: getReturnData(foundUser, { fields: userReturnFields }), tokens };
}

async function registerService(registerData: IUserCreationAttributes) {
  const foundUser = await findUserByOptionalAttributes({
    email: registerData.email,
    username: registerData.username,
  });

  if (foundUser) {
    if (foundUser.email === registerData.email)
      throw new BadRequestError("Email already registered!");
    if (foundUser.username === registerData.username)
      throw new BadRequestError("Username already existed!");
  }

  const salt = bcrypt.genSaltSync();
  const hashedPwd = bcrypt.hashSync(registerData.password, salt);
  const user = await createUser({
    ...registerData,
    role: ROLE.EMPLOYEE,
    address: getAddress(registerData.address),
    id: undefined,
    password: hashedPwd,
    salt,
  });

  if (!user) {
    throw new InternalServerError("Fail to create new user!");
  }

  const { privateKey, publicKey } = generateKeyPair();
  const tokens = generateTokenPair({
    payload: { ...user, userId: user.id },
    privateKey,
    publicKey,
  });
  await createKeyToken({
    userId: user.id,
    refreshToken: tokens.refreshToken,
    publicKey,
    privateKey,
  });

  return { user: getReturnData(user, { fields: userReturnFields }), tokens };
}

async function logoutService(userId: string) {
  return deleteKeyTokenByUserId(userId);
}

async function refreshTokenService(
  user: IUserJWTPayload,
  keyToken: KeyTokenModel,
  refreshToken: string
) {
  if (keyToken.refreshTokensUsed.includes(refreshToken)) {
    await deleteKeyTokenByUserId(user.userId);
    throw new ForbiddenError("Something went wrong. Login again!");
  }

  if (keyToken.refreshToken !== refreshToken) throw new BadRequestError("Invalid request!");

  const tokens = generateTokenPair({
    payload: user,
    privateKey: keyToken.privateKey,
    publicKey: keyToken.publicKey,
  });

  await updateRefreshTokensUsed(keyToken, tokens.refreshToken);

  return { tokens };
}

export { registerService, loginService, logoutService, refreshTokenService };
