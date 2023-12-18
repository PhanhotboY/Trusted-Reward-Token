import { UserModel } from "../models";
import { IUserAttributes, IUserCreationAttributes } from "../interfaces/user.interface";
import { Op, WhereOptions } from "sequelize";
import { removeNestedNullish } from "../utils";

async function createUser(attrs: IUserCreationAttributes) {
  return UserModel.create(attrs);
}

async function findUserByEmail(email: string) {
  return UserModel.findOne({ where: { email } });
}

async function findUserByOptionalAttributes({
  id,
  username,
  email,
  address,
}: Partial<IUserAttributes>) {
  return UserModel.findOne({
    where: { [Op.or]: removeNestedNullish([{ id }, { username }, { email }, { address }]) },
  });
}

export { createUser, findUserByEmail, findUserByOptionalAttributes };
