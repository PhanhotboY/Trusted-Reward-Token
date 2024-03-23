import { Op, Transaction, WhereOptions } from "sequelize";

import {
  IUserAttributes,
  IUserCreationAttributes,
  IUserDetails,
  IUserUniqueAttributes,
} from "../../interfaces/user.interface";
import { getUserQuery } from "./query";
import { USER } from "../../constants";
import { UserModel } from "../user.model";
import { checkUUIDv4 } from "../../helpers";
import { BalanceModel } from "../balance.model";
import { BadRequestError } from "../../core/errors";
import { IQueryOptions } from "../../interfaces/query.interface";
import { caculateOffset, removeNestedNullish } from "../../utils";

const includeBalance = { model: BalanceModel, as: "balance", attributes: ["reputationToken"] };

export function findUserById(id: string, options: IQueryOptions = { includeOrganization: false }) {
  checkUUIDv4(id);
  return getUserQuery({ id, isVerified: options.isVerified || true }, options);
}

export function findUserByEmail(email: string, isVerified = true) {
  return UserModel.findOne({
    where: { email, role: USER.ROLE.EMPLOYEE, isVerified },
    attributes: { exclude: ["password"] },
    include: includeBalance,
  }).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

export function findUsers(filter?: WhereOptions<IUserAttributes>, options?: IQueryOptions) {
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

export function createUser(attrs: IUserCreationAttributes, transaction?: Transaction) {
  return UserModel.create(
    {
      ...attrs,
      id: undefined,
      updatedAt: undefined,
      createdAt: undefined,
      deletedAt: undefined,
    },
    { transaction }
  ).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

export function findUserByOptionalAttributes(
  { id, username, email }: Partial<IUserUniqueAttributes>,
  isVerified = true,
  password = false
) {
  return getUserQuery(
    {
      [Op.or]: removeNestedNullish([{ id }, { username }, { email }]),
      role: { [Op.in]: Object.values(USER.ROLE) },
      isVerified,
    },
    { password }
  );
}

export async function updateUserById(id: string, data: Partial<IUserCreationAttributes>) {
  checkUUIDv4(id);
  const user = await findUserById(id);

  if (!user) throw new BadRequestError("User not found!");

  return user.update(data).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

export async function deleteUserById(id: string, transaction?: Transaction) {
  checkUUIDv4(id);
  const user = await findUserById(id);
  if (!user) throw new BadRequestError("User not found!");

  return await user.destroy({ transaction });
}

export const UserRepo = {
  findUserById,
  findUserByEmail,
  createUser,
  findUserByOptionalAttributes,
  updateUserById,
  deleteUserById,
};
