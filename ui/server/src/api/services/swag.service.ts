import { BadRequestError } from "../core/errors";
import { IQueryOptions } from "../interfaces/query.interface";
import { swagRepo } from "../models/repositories/swag.repo";
import { getReturnArray, getReturnData } from "../utils";
import { ISWagCreationAttributes } from "../interfaces/swag.interface";
import { createRequest } from "./request.service";
import { getMember, getMemberDetails, getUser } from ".";

export async function getSwagList(options: IQueryOptions) {
  try {
    const swags = await swagRepo.getSwags(options);
    return getReturnArray(swags);
  } catch (err) {
    throw new BadRequestError((<Error>err).message);
  }
}

export async function getSwag(id: string) {
  try {
    const swag = await swagRepo.findSwagById(id);
    if (!swag) throw new BadRequestError("Swag not found");

    return getReturnData(swag);
  } catch (err) {
    throw new BadRequestError((<Error>err).message);
  }
}

export async function createSwag(data: ISWagCreationAttributes) {
  try {
    const swag = await swagRepo.createSwag(data);
    return getReturnData(swag);
  } catch (err) {
    throw new BadRequestError((<Error>err).message);
  }
}

export async function updateSwag(id: string, data: ISWagCreationAttributes) {
  try {
    const swag = await swagRepo.updateSwag(id, data);
    return getReturnData(swag);
  } catch (err) {
    throw new BadRequestError((<Error>err).message);
  }
}

export async function deleteSwag(id: string) {
  try {
    await swagRepo.deleteSwag(id);
    return true;
  } catch (err) {
    throw new BadRequestError((<Error>err).message);
  }
}

export async function redeemSwag(userId: string, swagId: string) {
  try {
    const user = await getUser(userId);

    const swag = await swagRepo.findSwagById(swagId);
    if (!swag) throw new BadRequestError("Swag not found");

    return await createRequest({ requesterId: user.id, swagId: swag.id, amount: swag.value });
  } catch (err) {
    throw new BadRequestError((<Error>err).message);
  }
}

export const swagService = {
  getSwagList,
  getSwag,
  createSwag,
  updateSwag,
  deleteSwag,
  redeemSwag,
};
