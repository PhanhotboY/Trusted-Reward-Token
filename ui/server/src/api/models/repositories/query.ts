import { FindOptions, WhereOptions } from "sequelize";

import { isUUIDv4 } from "../../helpers";
import { UserModel } from "../user.model";
import { IUserAttributes, IUserDetails } from "../../interfaces/user.interface";
import { BadRequestError } from "../../core/errors";
import { IQueryOptions } from "../../interfaces/query.interface";
import { caculateOffset } from "../../utils";
import { OrganizationModel } from "../organization.model";
import { BalanceModel } from "../balance.model";
import { IRequestAttributes } from "../../interfaces/request.interface";
import { RequestModel } from "../request.model";
import { USER } from "../../constants";

function getOrganizationQuery(filter?: WhereOptions<IUserAttributes>, options?: IQueryOptions) {
  if ((<IUserAttributes>filter)?.orgId && !isUUIDv4((<IUserAttributes>filter).orgId!))
    throw new BadRequestError("Invalid organization id!");

  const { limit, order, orderBy, page, exclude = [] } = options || {};
  console.log("filter: ", filter);
  console.log("options: ", options);
  return UserModel.findAll({
    where: { isVerified: true, ...filter, role: USER.ROLE.ORGANIZATION },
    offset: caculateOffset(+page!, +limit!),
    limit: +limit! || 2,
    order: [[orderBy || "createdAt", order || "DESC"]],
    attributes: { exclude: ["password", ...exclude] },
    include: [
      {
        model: OrganizationModel,
        as: "organization",
      },
      {
        model: BalanceModel,
        as: "balance",
        attributes: ["reputationToken"],
      },
    ],
  }).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

function getRequestQuery(filter?: WhereOptions<IRequestAttributes>, options?: IQueryOptions) {
  filter && checkUUID<IRequestAttributes>(filter, "orgId");

  return RequestModel.findAll({
    where: filter,
    ...(options
      ? {
          offset: caculateOffset(+options.page!, +options.limit!),
          limit: +options.limit! || 2,
          order: [[options.orderBy || "createdAt", options.order || "DESC"]],
        }
      : {}),
  }).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  });
}

function getUserQuery(
  filter?: WhereOptions<IUserAttributes>,
  options: IQueryOptions = {
    includeOrganization: false,
    password: false,
  }
) {
  filter && checkUUID<IUserAttributes>(filter, "orgId");
  console.log("filter: ", filter);
  console.log("options: ", options);
  return UserModel.findOne({
    where: {
      isVerified: true,
      role: USER.ROLE.EMPLOYEE,
      ...filter,
    },
    attributes: { exclude: [options.password ? "" : "password", ...(options.exclude || [])] },
    include: [
      { model: BalanceModel, as: "balance", attributes: ["reputationToken"] },
      ...(options.includeOrganization ? [{ model: OrganizationModel, as: "organization" }] : []),
    ],
  }).catch((err) => {
    throw new BadRequestError(err.errors?.[0]?.message || err.message);
  }) as Promise<(UserModel & IUserDetails) | null>;
}

function checkUUID<T>(filter: WhereOptions<T>, field: keyof T) {
  if ((<T>filter)[field] && !isUUIDv4((<T>filter)[field] as string))
    throw new BadRequestError(`Invalid id: ${(<T>filter)[field]}`);
}

export { getOrganizationQuery, getRequestQuery, getUserQuery };
