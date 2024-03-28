import { BadRequestError } from "../core/errors";
import { IQueryOptions } from "../interfaces/query.interface";
import { swagRepo } from "../models/repositories/swag.repo";
import { getReturnArray, getReturnData } from "../utils";
import { ISWagCreationAttributes, ISwagAttributes } from "../interfaces/swag.interface";
import { createRequest } from "./request.service";
import { getMemberDetails, getUser, updateBalance } from ".";
import { pgInstance } from "../../db/init.postgresql";

export async function getSwagList(options: IQueryOptions) {
  const swags = await swagRepo.getSwags(options);
  return getReturnArray(swags);
}

export async function getSwag(id: string) {
  const swag = await swagRepo.findSwagById(id);
  if (!swag) throw new BadRequestError("Swag not found");

  return getReturnData(swag);
}

export async function createSwag(data: ISWagCreationAttributes) {
  const foundSwag = await swagRepo.findSwagById(data.id);
  if (foundSwag) throw new BadRequestError("Swag already exists");

  const swag = await swagRepo.createSwag(data);
  return getReturnData(swag);
}

export async function updateSwag(id: string, data: ISWagCreationAttributes) {
  await getSwag(id);

  await swagRepo.updateSwag(id, data);
  const swag = await getSwag(id);
  return getReturnData(swag);
}

export async function deleteSwag(id: string) {
  await getSwag(id);
  await swagRepo.deleteSwag(id);
  return true;
}

export async function redeemSwag(userId: string, swagId: string) {
  const member = await getMemberDetails(userId);
  const swag = await getSwag(swagId);

  if (member.balance.rewardToken < swag.value) throw new BadRequestError("Insufficient balance");

  const sequelize = pgInstance.getSequelize();
  const request = await sequelize.transaction(async (transaction) => {
    try {
      await updateBalance(
        member.id,
        { rewardToken: member.balance.rewardToken - swag.value },
        transaction
      );

      await createRequest(
        { requesterId: member.id, swagId: swag.id, amount: swag.value },
        transaction
      );

      const updatedMember = await getMemberDetails(userId);
      return getReturnData(updatedMember);
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  });

  return getReturnData(request);
}

export const swagService = {
  getSwagList,
  getSwag,
  createSwag,
  updateSwag,
  deleteSwag,
  redeemSwag,
};
