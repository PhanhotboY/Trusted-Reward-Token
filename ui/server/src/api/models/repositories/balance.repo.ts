import { Transaction } from "sequelize";
import { BalanceModel } from "../balance.model";

export function findBalanceByUserId(id: string) {
  return BalanceModel.findByPk(id);
}

export function createBalance(userId: string, transaction?: Transaction) {
  return BalanceModel.create({ userId }, { transaction });
}

export const BalanceRepo = {
  findBalanceByUserId,
  createBalance,
};
