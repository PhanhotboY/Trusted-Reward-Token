import { Transaction, WhereOptions } from "sequelize";

import { IRequestAttributes, IRequestCreationAttributes } from "../../interfaces/request.interface";
import { IQueryOptions } from "../../interfaces/query.interface";
import { getRequestQuery } from "./query";
import { RequestModel } from "../request.model";
import { checkUUIDv4 } from "../../helpers";
import { removeNestedNullish } from "../../utils";

export async function getRequestList(
  filter: WhereOptions<IRequestAttributes>,
  options?: IQueryOptions
) {
  return await getRequestQuery(filter, options);
}

export async function findRequest({ id, requesterId, status, type }: Partial<IRequestAttributes>) {
  id && checkUUIDv4(id);
  requesterId && checkUUIDv4(requesterId);
  console.log(
    "filter: ",
    JSON.parse(JSON.stringify(removeNestedNullish({ id, requesterId, status, type })))
  );
  return await RequestModel.findOne({
    where: JSON.parse(JSON.stringify(removeNestedNullish({ id, requesterId, status, type }))),
  });
}

export async function findRequestById(requestId: string) {
  console.log("requestId: ", requestId);
  checkUUIDv4(requestId);

  return await RequestModel.findByPk(requestId);
}

export async function updateRequest(id: string, data: Partial<IRequestCreationAttributes>) {
  checkUUIDv4(id);
  const request = await findRequestById(id);
  if (!request) throw new Error("Request not found!");

  return await request.update(removeNestedNullish(data));
}

export async function createRequest(
  data: Partial<IRequestCreationAttributes>,
  transaction?: Transaction
) {
  return await RequestModel.create(removeNestedNullish(data), { transaction });
}

export async function deleteRequest(id: string, transaction?: Transaction) {
  checkUUIDv4(id);
  const request = await findRequestById(id);
  if (!request) throw new Error("Request not found!");

  return await request.destroy({ transaction });
}

export const RequestRepo = {
  getRequestList,
  findRequest,
  findRequestById,
  updateRequest,
  createRequest,
  deleteRequest,
};
