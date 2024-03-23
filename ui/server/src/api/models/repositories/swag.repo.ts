import { checkUUIDv4 } from "../../helpers";
import { IQueryOptions } from "../../interfaces/query.interface";
import { ISWagCreationAttributes } from "../../interfaces/swag.interface";
import { caculateOffset, removeNestedNullish } from "../../utils";
import { SwagModel } from "../swag.model";

export async function findSwagById(id: string) {
  checkUUIDv4(id);
  return SwagModel.findByPk(id);
}

export async function getSwags({ limit, page, order, orderBy }: IQueryOptions) {
  return SwagModel.findAll({
    limit: +limit! || 10,
    offset: caculateOffset(+page!, +limit!),
    order: [[orderBy || "createdAt", order || "DESC"]],
  });
}

export async function createSwag(data: ISWagCreationAttributes) {
  return SwagModel.create(
    removeNestedNullish({
      ...data,
      id: undefined,
    })
  );
}

export async function updateSwag(id: string, data: ISWagCreationAttributes) {
  checkUUIDv4(id);
  const swag = await findSwagById(id);
  if (!swag) {
    throw new Error("Swag not found!");
  }
  return swag.update(removeNestedNullish(data));
}

export async function deleteSwag(id: string) {
  checkUUIDv4(id);
  const swag = await findSwagById(id);
  if (!swag) {
    throw new Error("Swag not found!");
  }
  return swag.destroy();
}

export const swagRepo = {
  getSwags,
  findSwagById,
  createSwag,
  updateSwag,
  deleteSwag,
};
