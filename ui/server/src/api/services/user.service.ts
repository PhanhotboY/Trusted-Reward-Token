import _ from "lodash";
import { Transaction, WhereOptions } from "sequelize";

import { BadRequestError, InternalServerError, NotFoundError } from "../core/errors";
import {
  IUserResponse,
  IUserAttributes,
  IUserCreationAttributes,
  IUserDetails,
  IUserUniqueAttributes,
} from "../interfaces/user.interface";
import { getReturnArray, getReturnData, pickWithNullish } from "../utils";
import { createBalance } from "../models/repositories";
import {
  findUserById,
  createUser,
  deleteUserById,
  findUserByOptionalAttributes,
  updateUserById,
  findUsers,
} from "../models/repositories/user.repo";
import { USER } from "../constants";
import { pgInstance } from "../../db/init.postgresql";
import { BalanceModel, UserModel } from "../models";
import { IQueryOptions } from "../interfaces/query.interface";

const userSensitiveFields: Array<keyof Omit<IUserDetails, keyof IUserResponse>> = [
  "password",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "isVerified",
];
const userPublicFields: Array<keyof IUserResponse> = [
  "id",
  "firstName",
  "lastName",
  "address",
  "email",
  "orgId",
  "title",
  "balance",
];

export async function getUserDetailsForAdmin(id: string) {
  const user = await findUserById(id);
  if (!user) throw new NotFoundError("User not found!");

  return getReturnData(user);
}

export async function getUserDetails(id: string) {
  const user = await findUserById(id, { isVerified: true, exclude: userSensitiveFields });
  if (!user) throw new NotFoundError("User not found!");

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
  { id, email, username, address }: Partial<IUserUniqueAttributes>,
  isVerified = true,
  password = false
) {
  return await findUserByOptionalAttributes({ id, email, username, address }, isVerified, password);
}

export async function updateUser(id: string, data: Partial<IUserAttributes>) {
  const user = await updateUserById(id, _.pick(data, ["firstName", "lastName", "title", "orgId"]));

  return getReturnData(user, { excludes: userSensitiveFields });
}

export async function registerUser(data: IUserCreationAttributes, transaction?: Transaction) {
  const foundUser = await findUserBy({
    email: data.email,
    username: data.username,
    address: data.address,
  });

  if (foundUser) {
    if (foundUser.email === data.email) throw new BadRequestError("Email already registered!");
    if (foundUser.username === data.username)
      throw new BadRequestError("Username already existed!");
    if (foundUser.address === data.address)
      throw new BadRequestError("Address already registered!");
  }

  const sequelize = pgInstance.getSequelize();
  const user = await sequelize.transaction(async (t: Transaction) => {
    const user: UserModel = await createUser(
      {
        ...data,
        role: data.role || USER.ROLE.EMPLOYEE,
        isVerified: data.isVerified || true,
        orgId: null,
      },
      transaction || t
    );
    if (!user) throw new InternalServerError("Fail to register new user!");

    // Create balance for new employee
    if (!data.role || data.role === USER.ROLE.EMPLOYEE)
      await createBalance(user.id, transaction || t);

    return user;
  });

  return findUserById(user.id, { role: data.role || USER.ROLE.EMPLOYEE });
}

export async function deleteUser(id: string) {
  try {
    await deleteUserById(id);
    return { id };
  } catch (err) {
    throw new InternalServerError("Cannot delete user!");
  }
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
