import { Op, Transaction, WhereOptions } from "sequelize";

import { OrganizationModel, UserModel } from "..";
import { USER } from "../../constants";
import {
  IOrganizationCreationAttributes,
  IOrganizationDetails,
} from "../../interfaces/organization.interface";
import { IQueryOptions } from "../../interfaces/query.interface";
import { getOrganizationQuery, getUserQuery } from "./query";
import { IUserAttributes, IUserUniqueAttributes } from "../../interfaces/user.interface";
import { isUUIDv4 } from "../../helpers";
import { BadRequestError } from "../../core/errors";
import { getUserList } from "../../services/user.service";

export function getOrganizations(filter?: WhereOptions<IUserAttributes>, options?: IQueryOptions) {
  return getOrganizationQuery(filter, options);
}

export function findOrganizationById(orgId: string, isVerified = true) {
  if (!isUUIDv4(orgId)) throw new BadRequestError(`Invalid id: ${orgId}`);

  return <Promise<(UserModel & IOrganizationDetails) | null>>(
    getUserQuery(
      { orgId, role: USER.ROLE.ORGANIZATION, isVerified },
      { includeOrganization: true, password: false }
    )
  );
}

export function findOrganizationByOptionalAttributes(
  filter: Partial<IUserUniqueAttributes>,
  isVerified = true
) {
  return getUserQuery({
    [Op.or]: [{ id: filter.id }, { username: filter.username }, { email: filter.email }],
    role: USER.ROLE.ORGANIZATION,
    isVerified,
  });
}

export function createrOrganization(
  attrs: IOrganizationCreationAttributes,
  transaction?: Transaction
) {
  return OrganizationModel.create(
    {
      ...attrs,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
    { transaction }
  ).catch((err) => {
    throw new BadRequestError(err.errors?.[0].message || err.message);
  });
}

export const OrganizationRepo = {
  getOrganizations,
  findOrganizationById,
  findOrganizationByOptionalAttributes,
  createrOrganization,
};
