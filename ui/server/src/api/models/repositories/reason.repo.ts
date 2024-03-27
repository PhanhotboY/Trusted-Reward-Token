import { Filterable, InferAttributes, Transaction, WhereOptions } from "sequelize";

import { MemberModel, ReasonModel, SubscriptionModel, UserModel } from "../";
import { IReasonCreationAttributes } from "../../interfaces/reason.interface";
import { IQueryOptions } from "../../interfaces/query.interface";
import { caculateOffset } from "../../utils";
import { BadRequestError } from "../../core/errors";
import {
  ISubscriptionAttributes,
  ISubscriptionCreationAttributes,
  ISubscriptionDetails,
} from "../../interfaces/subscription.interface";
import { checkUUIDv4 } from "../../helpers";

// create reason
export const createReason = async (reason: IReasonCreationAttributes) => {
  return await ReasonModel.create(reason);
};

// get reason
export const getReason = async (reasonId: string) => {
  checkUUIDv4(reasonId);
  return await ReasonModel.findByPk(reasonId);
};

// get reasons
export const getAllReasons = async (
  filter?: WhereOptions<InferAttributes<ReasonModel>>,
  options?: IQueryOptions
) => {
  const { limit = 2, page = 0, order = "DESC", orderBy = "createdAt" } = options || {};

  return await ReasonModel.findAll({
    where: filter,
    ...(options
      ? {
          offset: caculateOffset(page, limit),
          limit: +limit || 2,
          order: [[orderBy, order]],
        }
      : {}),
  });
};

// get member subscription reason
export const getReasonSubscription = async (memberId: string, reasonId: string) => {
  checkUUIDv4(memberId);
  checkUUIDv4(reasonId);

  return (await SubscriptionModel.findOne({
    where: {
      userId: memberId,
      reasonId,
    },
    include: [
      {
        model: UserModel,
        as: "subscriber",
        attributes: ["id", "orgId", "email", "hdWalletIndex", "fullName", "createdAt"],
        include: [{ model: MemberModel, as: "organization" }],
      },
      {
        model: ReasonModel,
        as: "reason",
      },
    ],
  })) as (ISubscriptionDetails & SubscriptionModel) | null;
};

export const getReasonSubscriptionList = async ({
  memberId,
  ...filter
}: { memberId: SubscriptionModel["userId"] } & Filterable<ISubscriptionAttributes>) => {
  checkUUIDv4(memberId);

  return await SubscriptionModel.findAll({
    where: {
      userId: memberId,
      ...filter,
    },
    include: [
      {
        model: ReasonModel,
        as: "reason",
      },
      {
        model: UserModel,
        as: "subscriber",
        attributes: ["id", "orgId", "email", "fullName", "createdAt"],
        include: [{ model: MemberModel, as: "organization" }],
      },
    ],
  });
};

// update reason
export const updateReason = async (reasonId: string, reason: IReasonCreationAttributes) => {
  checkUUIDv4(reasonId);
  return await ReasonModel.update(reason, { where: { id: reasonId } });
};

// remove reason
export const removeReason = async (reasonId: string) => {
  checkUUIDv4(reasonId);
  return await ReasonModel.destroy({ where: { id: reasonId } });
};

export const subscribeReason = async (data: ISubscriptionCreationAttributes) => {
  checkUUIDv4(data.userId || "");
  checkUUIDv4(data.reasonId || "");

  return await SubscriptionModel.create(data);
};

export const unsubscribeReason = async (memberId: string, reasonId: string) => {
  checkUUIDv4(memberId);
  checkUUIDv4(reasonId);

  const subscription = await SubscriptionModel.findOne({
    where: {
      userId: memberId,
      reasonId,
    },
  });
  if (!subscription) throw new BadRequestError("Subscription not found!");
  await subscription.destroy();

  return true;
};

export const commitReason = async (
  memberId: string,
  reasonId: string,
  transaction?: Transaction
) => {
  const subscription = await SubscriptionModel.findOne({
    where: {
      userId: memberId,
      reasonId,
    },
  });
  if (!subscription) throw new BadRequestError("You have not subscribed for this reason!");

  await subscription.update({ isCommitted: true, committedAt: new Date() }, { transaction });

  return true;
};

export const uncommitReason = async (
  memberId: string,
  reasonId: string,
  transaction?: Transaction
) => {
  checkUUIDv4(memberId);
  checkUUIDv4(reasonId);

  const subscription = await SubscriptionModel.findOne({
    where: {
      userId: memberId,
      reasonId,
    },
  });
  if (!subscription) throw new BadRequestError("Subscription not found!");
  await subscription.update({ isCommitted: false, committedAt: undefined }, { transaction });

  return true;
};

export const deleteReason = async (reasonId: string) => {
  checkUUIDv4(reasonId);
  return await ReasonModel.destroy({ where: { id: reasonId } });
};

export const ReasonRepo = {
  createReason,
  getReason,
  getAllReasons,
  getReasonSubscription,
  getReasonSubscriptionList,
  updateReason,
  removeReason,
  subscribeReason,
  unsubscribeReason,
  commitReason,
  uncommitReason,
  deleteReason,
};
