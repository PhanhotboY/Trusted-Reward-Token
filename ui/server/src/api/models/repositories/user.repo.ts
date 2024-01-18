import { Op, Transaction, WhereOptions } from "sequelize";
import { getAddress } from "ethers";

import { UserModel } from "../user.model";
import { caculateOffset, removeNestedNullish } from "../../utils";
import {
  IUserAttributes,
  IUserCreationAttributes,
  IUserDetails,
  IUserUniqueAttributes,
} from "../../interfaces/user.interface";
import { BadRequestError, NotFoundError } from "../../core/errors";
import { USER } from "../../constants";
import { BalanceModel } from "../balance.model";
import { getUserQuery } from "./query";
import { isUUIDv4 } from "../../helpers";
import { IQueryOptions } from "../../interfaces/query.interface";

const includeBalance = { model: BalanceModel, as: "balance", attributes: ["reputationToken"] };

export async function findUserById(
  id: string,
  options: IQueryOptions = { includeOrganization: false }
) {
  if (!isUUIDv4(id)) throw new BadRequestError(`Invalid id: ${id}`);

  return getUserQuery(
    { id, isVerified: options.isVerified || true, role: options.role || USER.ROLE.EMPLOYEE },
    options
  );
}

export async function findUserByEmail(email: string, isVerified = true) {
  return UserModel.findOne({
    where: { email, role: USER.ROLE.EMPLOYEE, isVerified },
    attributes: { exclude: ["password"] },
    include: includeBalance,
  }).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

export async function findUsers(filter?: WhereOptions<IUserAttributes>, options?: IQueryOptions) {
  return UserModel.findAll({
    where: { role: USER.ROLE.EMPLOYEE, ...filter, isVerified: true },
    offset: caculateOffset(+options?.page!, +options?.limit!),
    limit: +options?.limit! || 2,
    order: [[options?.orderBy || "createdAt", options?.order || "DESC"]],
    attributes: { exclude: ["password", ...(options?.exclude || [])] },
    include: { model: BalanceModel, as: "balance" },
  }).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  }) as Promise<Array<UserModel & IUserDetails>>;
}

export async function createUser(attrs: IUserCreationAttributes, transaction?: Transaction) {
  return UserModel.create(
    {
      ...attrs,
      id: undefined,
      address: attrs.address && getAddress(attrs.address),
      updatedAt: undefined,
      createdAt: undefined,
      deletedAt: undefined,
    },
    { transaction }
  ).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

export async function findUserByOptionalAttributes(
  { id, username, email, address }: Partial<IUserUniqueAttributes>,
  isVerified = true,
  password = false
) {
  return getUserQuery(
    {
      [Op.or]: removeNestedNullish([{ id }, { username }, { email }, { address }]),
      role: { [Op.in]: Object.values(USER.ROLE) },
      isVerified,
    },
    { password }
  );
}

export async function updateUserById(id: string, data: Partial<IUserCreationAttributes>) {
  const user = await findUserById(id);

  if (!user) throw new NotFoundError("User not found!");

  return user.update(data).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

export async function deleteUserById(id: string) {
  const user = await findUserById(id);

  if (!user) throw new NotFoundError("User not found!");

  return user.destroy().catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

export const UserRepo = {
  findUserById,
  findUserByEmail,
  createUser,
  findUserByOptionalAttributes,
  updateUserById,
  deleteUserById,
};
