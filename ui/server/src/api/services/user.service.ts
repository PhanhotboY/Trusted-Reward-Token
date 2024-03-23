import _ from "lodash";
import { Transaction, WhereOptions } from "sequelize";

import { BadRequestError, InternalServerError } from "../core/errors";
import {
  IUserResponse,
  IUserAttributes,
  IUserCreationAttributes,
  IUserDetails,
  IUserUniqueAttributes,
} from "../interfaces/user.interface";
import { USER } from "../constants";
import { UserModel } from "../models";
import { getReturnArray, getReturnData } from "../utils";
import { pgInstance } from "../../db/init.postgresql";
import { createBalance } from "../models/repositories";
import { IQueryOptions } from "../interfaces/query.interface";
import {
  findUserById,
  createUser,
  deleteUserById,
  findUserByOptionalAttributes,
  updateUserById,
  findUsers,
} from "../models/repositories/user.repo";

const userSensitiveFields: Array<keyof Omit<IUserDetails, keyof IUserResponse>> = [
  "password",
  "deletedAt",
  "isVerified",
];
const userPublicFields: Array<keyof IUserResponse> = [
  "id",
  "fullName",
  "email",
  "orgId",
  "balance",
  "createdAt",
];

export async function getUserDetailsForAdmin(id: string) {
  const user = await findUserById(id);
  if (!user) throw new BadRequestError("User not found!");

  return getReturnData(user);
}

export async function getUserDetails(id: string) {
  const user = await findUserById(id, { isVerified: true, exclude: userSensitiveFields });

  if (!user) throw new BadRequestError("User not found!");

  return getReturnData(user);
}

export async function getUser(id: string) {
  const user = await getUserDetails(id);

  return getReturnData(user, { fields: userPublicFields });
}

export async function getUserList(filter?: WhereOptions<IUserAttributes>, options?: IQueryOptions) {
  const users = await findUsers(filter, options);

  return getReturnArray<IUserDetails>(users, { fields: userPublicFields });
}

export async function findUserBy(
  { id, email, username }: Partial<IUserUniqueAttributes>,
  isVerified = true,
  password = false
) {
  return await findUserByOptionalAttributes({ id, email, username }, isVerified, password);
}

export async function updateUser(id: string, data: Partial<IUserAttributes>) {
  const user = await updateUserById(id, _.pick(data, ["fullName", "orgId"]));

  return getReturnData(user, { excludes: userSensitiveFields });
}

export async function registerUser(data: IUserCreationAttributes, transaction?: Transaction) {
  const foundUser = await findUserBy({
    email: data.email,
    username: data.username,
  });

  if (foundUser) {
    if (foundUser.email === data.email) throw new BadRequestError("Email already registered!");
    if (foundUser.username === data.username)
      throw new BadRequestError("Username already existed!");
  }

  const sequelize = pgInstance.getSequelize();
  const user = await sequelize.transaction(async (t: Transaction) => {
    const user: UserModel = await createUser(
      {
        ...data,
        role: data.role || USER.ROLE.EMPLOYEE,
        isVerified: data.isVerified || true,
        orgId: data.orgId || null,
      },
      transaction || t
    );
    if (!user) throw new InternalServerError("Fail to register new user!");

    // Create balance for new employee
    // @ts-ignore
    if ([USER.ROLE.EMPLOYEE, USER.ROLE.MEMBER].includes(user.role))
      await createBalance(user.id, transaction || t);

    return user;
  });

  return user;
}

export async function deleteUser(id: string, transaction?: Transaction) {
  await deleteUserById(id, transaction);
  return { id };
}

export const UserService = {
  getUserDetailsForAdmin,
  getUserDetails,
  getUserList,
  getUser,
  findUserBy,
  updateUser,
  registerUser,
  deleteUser,
};
