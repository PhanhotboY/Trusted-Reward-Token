import bcrypt from "bcrypt";

import { BadRequestError, ForbiddenError, InternalServerError } from "../core/errors";
import { generateKeyPair, generateTokenPair } from "../utils/keytoken";
import {
  IUserAttributes,
  IUserResponse,
  IUserCreationAttributes,
  IUserJWTPayload,
} from "../interfaces/user.interface";
import { Unionize, getReturnData } from "../utils";
import { KeyTokenModel } from "../models";
import {
  findUserBy,
  UserService,
  createKeyToken,
  deleteKeyTokenByUserId,
  updateRefreshTokensUsed,
} from "./";
import { USER } from "../constants";

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
  const foundUser = await findUserBy({ email, username }, true, true);
  if (!foundUser) {
    throw new BadRequestError("Not registered!");
  }

  const isMatchPwd = bcrypt.compareSync(password, foundUser.password);

  if (!isMatchPwd) {
    throw new BadRequestError("Authentication Failed!");
  }

  const { privateKey, publicKey } = generateKeyPair();
  const tokens = generateTokenPair({
    payload: { userId: foundUser.id, email: foundUser.email, role: foundUser.role },
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

  return {
    user: getReturnData<IUserAttributes, IUserResponse>(foundUser, { fields: userReturnFields }),
    tokens,
  };
}

async function registerService(
  registerData: IUserCreationAttributes,
  role: Unionize<typeof USER.ROLE> = USER.ROLE.EMPLOYEE
) {
  const salt = bcrypt.genSaltSync();
  const hashedPwd = bcrypt.hashSync(registerData.password, salt);
  const user = await UserService.registerUser({
    ...registerData,
    role,
    isVerified: true,
    orgId: null,
    password: hashedPwd,
  });

  if (!user) {
    throw new InternalServerError("Fail to create new user!");
  }

  const { privateKey, publicKey } = generateKeyPair();
  const tokens = generateTokenPair({
    payload: { userId: user.id, email: user.email, role: user.role },
    privateKey,
    publicKey,
  });
  await createKeyToken({
    userId: user.id,
    refreshToken: tokens.refreshToken,
    publicKey,
    privateKey,
  });

  return {
    user: getReturnData<IUserAttributes, IUserResponse>(user, { fields: userReturnFields }),
    tokens,
  };
}

async function logoutService(userId: string) {
  return deleteKeyTokenByUserId(userId);
}

async function refreshTokenService(
  user: IUserJWTPayload,
  keyToken: KeyTokenModel,
  refreshToken: string
) {
  console.log(keyToken.refreshTokensUsed, refreshToken);
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
