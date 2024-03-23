import { getReturnData } from "../utils";
import { NotFoundError } from "../core/errors";
import { BalanceRepo as Br } from "../models/repositories";
import { IBalanceCreationAttributes } from "../interfaces/balance.interface";

async function getFullBalance(id: string) {
  const balance = await Br.findBalanceByUserId(id);

  if (!balance) {
    throw new NotFoundError("Not registered!");
  }

  return getReturnData(balance);
}

async function getReputationBalance(id: string) {
  const balance = await getFullBalance(id);

  return getReturnData(balance, { fields: ["userId", "reputationToken"] });
}

async function createBalance(userId: string) {
  return Br.createBalance(userId);
}

// async function renewalBalance(id: string) {
//   const balance = await getFullBalance(id);

//   return Br.renewalBalance(balance);
// }

async function updateBalance(userId: string, balance: IBalanceCreationAttributes) {
  return Br.updateBalance(userId, balance);
}

export { getReputationBalance, getFullBalance, createBalance, updateBalance };
