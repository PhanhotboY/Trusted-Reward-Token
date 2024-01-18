import { NotFoundError } from "../core/errors";
import { BalanceRepo as Br } from "../models/repositories";

async function getFullBalance(id: string) {
  const balance = await Br.findBalanceByUserId(id);

  if (!balance) {
    throw new NotFoundError("Not registered!");
  }

  return balance;
}

async function getReputationBalance(id: string) {
  const balance = await getFullBalance(id);

  return { userId: balance.userId, reputationToken: balance.reputationToken };
}

async function createBalance(userId: string) {
  return Br.createBalance(userId);
}

export { getReputationBalance, getFullBalance, createBalance };
