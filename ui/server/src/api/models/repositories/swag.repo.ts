import { checkUUIDv4 } from "../../helpers";
import { IQueryOptions } from "../../interfaces/query.interface";
import { ISWagCreationAttributes, ISwagAttributes } from "../../interfaces/swag.interface";
import { caculateOffset, removeNestedNullish } from "../../utils";
import { SwagModel } from "../swag.model";

export async function findSwagById(id: string) {
  checkUUIDv4(id);
  return (await SwagModel.findByPk(id)) as SwagModel & ISwagAttributes;
}

export async function getSwags({ limit, page, order, orderBy }: IQueryOptions) {
  return (await SwagModel.findAll({
    limit: +limit! || 10,
    offset: caculateOffset(+page!, +limit!),
    order: [[orderBy || "createdAt", order || "DESC"]],
  })) as Array<SwagModel & ISwagAttributes>;
}

export async function createSwag(data: ISWagCreationAttributes) {
  return (await SwagModel.create(
    removeNestedNullish({
      ...data,
      id: undefined,
    })
  )) as SwagModel & ISwagAttributes;
}

export async function updateSwag(id: string, data: ISWagCreationAttributes) {
  checkUUIDv4(id);

  return await SwagModel.update({ id }, removeNestedNullish(data));
}

export async function deleteSwag(id: string) {
  checkUUIDv4(id);

  return await SwagModel.destroy({ where: { id } });
}

export const swagRepo = {
  getSwags,
  findSwagById,
  createSwag,
  updateSwag,
  deleteSwag,
};
