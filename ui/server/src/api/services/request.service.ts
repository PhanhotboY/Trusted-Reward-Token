import { formatEther, parseEther } from "ethers";

import {
  verifyMember,
  getMemberDetails,
  burnRewardToken,
  getFullBalanceOf,
  getSwag,
  mintRewardToken,
  mintRewardTokenForMember,
  getMemberEmployeeList,
} from "../services";
import { REQUEST } from "../constants";
import { getReasonSubscription, uncommitReason } from "./reason.service";
import { getHDNodeWallet } from "../utils/hdWallet";
import { getReturnArray, getReturnData } from "../utils";
import { IQueryOptions } from "../interfaces/query.interface";
import { BadRequestError, InternalServerError } from "../core/errors";
import { RequestRepo, deleteRequest, updateBalance, updateRequest } from "../models/repositories";
import { IRequestAttributes, IRequestCreationAttributes } from "../interfaces/request.interface";
import { Transaction } from "sequelize";
import { pgInstance } from "../../db/init.postgresql";

interface IHandlerOptions {
  action?: "approve" | "reject";
  message?: string;
}

export async function getRequestList(
  filter: { requesterId?: string; status?: string; type?: string } & Partial<IQueryOptions>
) {
  const requestList = await RequestRepo.getRequestList(filter, { ...filter });

  return getReturnArray(requestList);
}

export async function getRequestById(id: string) {
  const request = await RequestRepo.findRequestById(id);
  if (!request) throw new BadRequestError("Request not found!");

  return getReturnData(request);
}

export async function getRequest(filter: Partial<IRequestAttributes>) {
  const request = await RequestRepo.findRequest(filter);
  if (!request) throw new BadRequestError("Request not found!");

  return getReturnData(request);
}

export async function createRequest(
  data: Partial<Pick<IRequestCreationAttributes, "reasonId" | "swagId" | "receiverId">> & {
    requesterId: IRequestCreationAttributes["requesterId"];
    amount: IRequestCreationAttributes["amount"];
    message?: IRequestCreationAttributes["message"];
  },
  transaction?: Transaction
) {
  const { requesterId, swagId, reasonId, receiverId, amount, message } = data;
  if (!swagId && !reasonId && !receiverId) throw new BadRequestError("Invalid request data");

  const type = swagId
    ? REQUEST.TYPE.REDEEM
    : reasonId
    ? REQUEST.TYPE.GRANTING
    : REQUEST.TYPE.TRANSFER;

  const objectId = {
    swagId: swagId || null,
    reasonId: (!swagId && reasonId) || null,
    receiverId: (!swagId && !reasonId && receiverId) || null,
  };

  const request = await RequestRepo.createRequest(
    {
      ...objectId,
      type,
      requesterId,
      amount,
      message,
      status: REQUEST.STATUS.PENDING,
      completedAt: null,
    },
    transaction
  );

  return getReturnData<IRequestAttributes>(request);
}

export async function withdrawRequest(requestId: string) {
  const request = await getRequestById(requestId);
  if (request.status !== REQUEST.STATUS.PENDING) {
    throw new BadRequestError("Request already processed");
  }

  const sequelize = pgInstance.getSequelize();

  const isWithdrawn = await sequelize.transaction(async (tx) => {
    try {
      await deleteRequest(request.id, tx);
      return await uncommitReason(request.requesterId, request.reasonId || "", tx);
    } catch (error) {
      console.error(error);
      tx.rollback();
      throw error;
    }
  });

  return isWithdrawn;
}

async function processRedeemRequest(requestId: string, options?: IHandlerOptions) {
  const request = await getRequest({ id: requestId, type: REQUEST.TYPE.REDEEM });
  if (request.status !== REQUEST.STATUS.PENDING) {
    throw new BadRequestError("Request already processed");
  }
  if (!options?.action || options.action === "reject") {
    console.log("rejecting request");
    const processedRequest = await updateRequest(request.id, {
      status: REQUEST.STATUS.REJECTED,
      message: options?.message,
    });
    return getReturnData(processedRequest);
  }

  const member = await getMemberDetails(request.requesterId);
  const swag = await getSwag(request.swagId || "");

  const memberWallet = getHDNodeWallet(member.hdWalletIndex);

  try {
    const balanceBefore = await getFullBalanceOf(memberWallet.address);
    console.log("balanceBefore", balanceBefore);

    if (balanceBefore.rewardToken < parseEther(swag.value.toString())) {
      const processedRequest = await updateRequest(request.id, {
        status: REQUEST.STATUS.REJECTED,
        message: "Insufficient balance",
      });
      return getReturnData(processedRequest);
    }

    const burnResult = await burnRewardToken(memberWallet.address, swag.value, "0x0");
    console.log("burn log: ", burnResult?.logs);

    const balanceAfter = await getFullBalanceOf(memberWallet.address);
    console.log("balanceAfter", balanceAfter);

    await updateBalance(
      member.id,
      Object.keys(balanceAfter).reduce(
        (balance, token) => ({
          ...balance,
          [token]: +formatEther(balanceAfter[token as keyof typeof balanceAfter]),
        }),
        {}
      )
    );
  } catch (err) {
    console.error(err);
    throw new InternalServerError("Error processing request");
  }

  const processedRequest = await updateRequest(request.id, {
    status: REQUEST.STATUS.APPROVED,
    message: options?.message,
  });

  return getReturnData(processedRequest);
}

async function processGrantingRequest(requestId: string, options?: IHandlerOptions) {
  const request = await getRequest({ id: requestId, type: REQUEST.TYPE.GRANTING });
  if (request.status !== REQUEST.STATUS.PENDING) {
    throw new BadRequestError("Request already processed");
  }
  if (!options?.action || options.action === "reject") {
    const processedRequest = await updateRequest(request.id, {
      status: REQUEST.STATUS.REJECTED,
      message: options?.message,
    });
    return getReturnData(processedRequest);
  }

  const reasonSubscription = await getReasonSubscription(
    request.requesterId,
    request.reasonId || ""
  );
  const { subscriber: member, reason } = reasonSubscription;

  const memberWallet = getHDNodeWallet(member.hdWalletIndex);

  const balanceBefore = await getFullBalanceOf(memberWallet.address);
  console.log("balanceBefore", balanceBefore);

  const employeeList = await getMemberEmployeeList(member.id);
  if (!employeeList.length) {
    throw new BadRequestError("Member has no employee!");
  }
  const employeeAddresses = employeeList.reduce<Array<string>>(
    (employeeAddresses, employee) => [
      ...employeeAddresses,
      getHDNodeWallet(employee.hdWalletIndex).address,
    ],
    []
  );
  const mintResult = await mintRewardTokenForMember(
    memberWallet.address,
    employeeAddresses,
    reason.value
  );

  console.log("mint log: ", mintResult?.logs);

  const balanceAfter = await getFullBalanceOf(memberWallet.address);
  console.log("balanceAfter", balanceAfter);

  await updateBalance(
    member.id,
    Object.keys(balanceAfter).reduce(
      (balance, token) => ({
        ...balance,
        [token]: +formatEther(balanceAfter[token as keyof typeof balanceAfter]),
      }),
      {}
    )
  );
  const processedRequest = await updateRequest(request.id, {
    status: REQUEST.STATUS.APPROVED,
    message: options?.message,
  });

  return getReturnData(processedRequest);
}

async function processTransferRequest(id: string, options?: IHandlerOptions) {
  try {
    throw new BadRequestError("Not implemented!");
  } catch (error) {
    throw new BadRequestError((<Error>error).message);
  }
}

const handleRequestMethod = {
  redeem: processRedeemRequest,
  // transfer: processTransferRequest,
  granting: processGrantingRequest,
};

export async function requestHandler({
  requestId,
  op,
  options,
}: {
  requestId: string;
  op: keyof typeof handleRequestMethod;
  options?: IHandlerOptions;
}) {
  if (!Object.keys(handleRequestMethod).includes(op))
    throw new BadRequestError("Invalid operation!");

  return handleRequestMethod[op](requestId, options);
}

export const RequestService = {
  getRequestList,
  getRequest,
  getRequestById,
  requestHandler,
  withdrawRequest,
};
