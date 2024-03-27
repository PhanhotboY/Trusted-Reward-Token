import { Op, WhereOptions } from "sequelize";

import { REQUEST, USER } from "../../constants";
import { isUUIDv4 } from "../../helpers";
import { UserModel } from "../user.model";
import { caculateOffset } from "../../utils";
import { MemberModel } from "../member.model";
import { BalanceModel } from "../balance.model";
import { RequestModel } from "../request.model";
import { BadRequestError } from "../../core/errors";
import { IQueryOptions } from "../../interfaces/query.interface";
import { IRequestAttributes } from "../../interfaces/request.interface";
import { IUserAttributes, IUserDetails } from "../../interfaces/user.interface";
import { SwagModel } from "../swag.model";
import { ReasonModel } from "../reason.model";

const includeBalance = {
  model: BalanceModel,
  as: "balance",
  attributes: ["rewardToken", "penaltyToken", "reputationToken"],
};
const includeOrganization = { model: MemberModel, as: "organization" };

/**
 * @description Get a list of organizations
 */
function getOrganizationQuery(filter?: WhereOptions<IUserAttributes>, options?: IQueryOptions) {
  if ((<IUserAttributes>filter)?.orgId && !isUUIDv4((<IUserAttributes>filter).orgId!))
    throw new BadRequestError("Invalid organization id!");

  const { limit, order = "DESC", orderBy = "createdAt", page = 0, exclude = [] } = options || {};
  console.log("filter org: ", filter);
  console.log("options: ", options);

  return UserModel.findAll({
    where: { isVerified: true, ...filter, role: USER.ROLE.MEMBER },
    offset: caculateOffset(page, limit),
    limit: +limit! || 12,
    order: [[orderBy, order]],
    attributes: { exclude: ["password", ...exclude] },
    include: [includeOrganization, includeBalance],
  }).catch(errorHandler);
}

/**
 * @description Get a list of requests
 */
function getRequestQuery(filter?: WhereOptions<IRequestAttributes>, options?: IQueryOptions) {
  filter && checkUUID<IRequestAttributes>(filter, "requesterId");
  const { limit = 12, page = 0, order = "DESC", orderBy = "createdAt" } = options || {};

  return RequestModel.findAll({
    where: {
      ...filter,
      status: { [Op.in]: [...Object.values(REQUEST.STATUS)] },
      type: { [Op.in]: [REQUEST.TYPE.REDEEM, REQUEST.TYPE.GRANTING] },
    },
    ...(options
      ? {
          offset: caculateOffset(page, limit),
          limit: +limit || 2,
          order: [[orderBy, order]],
        }
      : {}),
    include: [
      {
        model: UserModel,
        as: "requester",
        include: [includeOrganization],
        attributes: ["id", "email", "orgId", "createdAt"],
        required: true,
        duplicating: false,
      },
      {
        model: UserModel,
        as: "receiver",
        attributes: ["id", "email", "orgId", "createdAt"],
        required: false,
        duplicating: true,
      },
      {
        model: SwagModel,
        as: "swag",
      },
      {
        model: ReasonModel,
        as: "reason",
      },
    ],
  }).catch(errorHandler) as Promise<Array<RequestModel & IRequestAttributes>>;
}

/**
 * @description Get a user
 */
function getUserQuery(
  filter?: WhereOptions<IUserAttributes>,
  options: IQueryOptions = {
    includeOrganization: false,
    password: false,
  }
) {
  filter && checkUUID<IUserAttributes>(filter, "orgId");
  console.log("filter user: ", filter);
  console.log("options: ", options);

  return UserModel.findOne({
    where: {
      isVerified: true,
      role: { [Op.in]: [USER.ROLE.ADMIN, USER.ROLE.MEMBER, USER.ROLE.EMPLOYEE] },
      ...filter,
    },
    attributes: { exclude: [options.password ? "" : "password", ...(options.exclude || [])] },
    include: [includeBalance, ...(options.includeOrganization ? [includeOrganization] : [])],
  }).catch(errorHandler) as Promise<(UserModel & IUserDetails) | null>;
}

function checkUUID<T>(filter: WhereOptions<T>, field: keyof T) {
  if ((<T>filter)[field] && !isUUIDv4((<T>filter)[field] as string))
    throw new BadRequestError(`Invalid id: ${(<T>filter)[field]}`);
}

const errorHandler = (err: any) => {
  console.log("query error: ", err.errors?.[0]?.message || err.message);
  throw new BadRequestError(err.errors?.[0]?.message || err.message);
};

export { getOrganizationQuery, getRequestQuery, getUserQuery };
