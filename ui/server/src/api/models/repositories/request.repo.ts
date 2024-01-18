import { WhereOptions } from "sequelize";

import { IRequestAttributes } from "../../interfaces/request.interface";
import { IQueryOptions } from "../../interfaces/query.interface";
import { getRequestQuery } from "./query";

export function getRequestList(filter: WhereOptions<IRequestAttributes>, options?: IQueryOptions) {
  return getRequestQuery(filter, options);
}

export const RequestRepo = {
  getRequestList,
};
