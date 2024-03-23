import { Transaction } from "sequelize";
import { createRequest } from ".";
import { pgInstance } from "../../db/init.postgresql";
import { BadRequestError } from "../core/errors";
import { checkUUIDv4 } from "../helpers";
import { IReasonAttributes } from "../interfaces/reason.interface";
import {
  ISubscriptionAttributes,
  ISubscriptionDetails,
} from "../interfaces/subscription.interface";
import { SubscriptionModel } from "../models";
import { ReasonRepo } from "../models/repositories";
import { getReturnArray, getReturnData } from "../utils";
import { getHDNodeWallet } from "../utils/hdWallet";
import { getMember } from "./member.service";
import { IQueryOptions } from "../interfaces/query.interface";

export const getReasonList = async () => {
  const reasons = await ReasonRepo.getAllReasons();
  return getReturnArray<IReasonAttributes>(reasons);
};

export const getReasonById = async (reasonId: string) => {
  checkUUIDv4(reasonId);

  const reason = await ReasonRepo.getReason(reasonId);
  if (!reason) throw new BadRequestError("Reason not found!");

  return reason;
};

export const createReason = async (reason: IReasonAttributes) => {
  const newReason = await ReasonRepo.createReason(reason);
  return getReturnData(newReason);
};

export const getReasonSubscription = async (memberId: string, reasonId: string) => {
  const subscription = await ReasonRepo.getReasonSubscription(memberId, reasonId);
  if (!subscription) throw new BadRequestError("Reason not subscribed!");

  return <ISubscriptionDetails & SubscriptionModel>subscription;
};

export const getReasonSubscriptionList = async (
  memberId: string,
  filter?: Partial<ISubscriptionAttributes>
) => {
  checkUUIDv4(memberId);

  const subscriptions = await ReasonRepo.getReasonSubscriptionList({ memberId, ...filter });
  return getReturnArray(subscriptions);
};

export const subscribeReason = async (memberId: string, reasonId: string) => {
  const subscription = await ReasonRepo.getReasonSubscription(memberId, reasonId);
  if (subscription) throw new BadRequestError("Reason already subscribed!");

  const newSubscription = await ReasonRepo.subscribeReason({
    userId: memberId,
    reasonId,
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });

  return getReturnData(newSubscription);
};

export const unsubscribeReason = async (memberId: string, reasonId: string) => {
  checkUUIDv4(memberId);
  checkUUIDv4(reasonId);

  return await ReasonRepo.unsubscribeReason(memberId, reasonId);
};

export const commitReason = async (memberId: string, reasonId: string, message: string) => {
  const subscription = await getReasonSubscription(memberId, reasonId);
  if (subscription.isCommitted) throw new BadRequestError("Reason already committed!");

  const sequelize = pgInstance.getSequelize();

  const isCommitted = await sequelize.transaction(async (tx) => {
    // create a granting request
    try {
      await createRequest(
        {
          requesterId: subscription.userId,
          reasonId: subscription.reasonId,
          message,
          amount: subscription.reason.value,
        },
        tx
      );

      return await ReasonRepo.commitReason(memberId, reasonId, tx);
    } catch (error) {
      console.error(error);
      tx.rollback();
      throw error;
    }
  });

  return isCommitted;
};

export const uncommitReason = async (
  memberId: string,
  reasonId: string,
  transaction?: Transaction
) => {
  return await ReasonRepo.uncommitReason(memberId, reasonId, transaction);
};

export const deleteReason = async (reasonId: string) => {
  checkUUIDv4(reasonId);

  return await ReasonRepo.deleteReason(reasonId);
};

export const ReasonService = {
  getReasonList,
  getReasonById,
  createReason,
  subscribeReason,
  unsubscribeReason,
  commitReason,
  getReasonSubscription,
  getReasonSubscriptionList,
  deleteReason,
};
