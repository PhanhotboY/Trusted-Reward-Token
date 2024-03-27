import { Transaction } from "sequelize";
import { BalanceModel } from "../balance.model";
import { IBalanceCreationAttributes } from "../../interfaces/balance.interface";

export function findBalanceByUserId(id: string) {
  return BalanceModel.findByPk(id);
}

export async function createBalance(userId: string, transaction?: Transaction) {
  return await BalanceModel.create({ userId }, { transaction });
}

export async function updateBalance(
  userId: string,
  balance: IBalanceCreationAttributes,
  transaction?: Transaction
) {
  return await BalanceModel.update({ ...balance, userId }, { where: { userId }, transaction });
}

export const BalanceRepo = {
  findBalanceByUserId,
  createBalance,
  updateBalance,
};
