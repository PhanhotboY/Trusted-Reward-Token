import { getReturnData } from "../utils";
import { NotFoundError } from "../core/errors";
import { BalanceRepo as Br } from "../models/repositories";
import { IBalanceAttributes, IBalanceCreationAttributes } from "../interfaces/balance.interface";
import { getFullBalanceOf } from "./token.service";
import { getMemberDetails, getMemberEmployeeList } from "./member.service";
import { formatEther } from "ethers";
import { pgInstance } from "../../db/init.postgresql";
import { Transaction } from "sequelize";

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
  return await Br.createBalance(userId);
}

// async function renewalBalance(id: string) {
//   const balance = await getFullBalance(id);

//   return Br.renewalBalance(balance);
// }

async function updateBalance(
  userId: string,
  balance: IBalanceCreationAttributes,
  transaction?: Transaction
) {
  return await Br.updateBalance(userId, balance, transaction);
}

async function syncBalance(userId: string, transaction?: Transaction) {
  const balance = await getFullBalanceOf(userId);

  return await updateBalance(
    userId,
    Object.keys(balance).reduce<IBalanceCreationAttributes>(
      (acc, key) => ({
        ...acc,
        [key]: +formatEther(balance[key as keyof typeof balance]) || 0,
      }),
      {}
    ),
    transaction
  );
}

async function syncBalanceForOrg(orgId: string, transaction?: Transaction) {
  const member = await getMemberDetails(orgId);
  const employees = await getMemberEmployeeList(orgId);

  const sequelize = pgInstance.getSequelize();
  await sequelize.transaction(async (tx) => {
    try {
      await syncBalance(member.id, transaction || tx);
      for (const emp of employees) {
        await syncBalance(emp.id, transaction || tx);
      }
    } catch (error) {
      transaction ? transaction.rollback() : tx.rollback();
      throw error;
    }
  });
}

export {
  getReputationBalance,
  getFullBalance,
  createBalance,
  updateBalance,
  syncBalance,
  syncBalanceForOrg,
};
