import { Op, Transaction, WhereOptions } from "sequelize";

import { BalanceModel, MemberModel, UserModel } from "..";
import { USER } from "../../constants";
import { IMemberCreationAttributes, IMemberDetails } from "../../interfaces/member.interface";
import { IQueryOptions } from "../../interfaces/query.interface";
import { getOrganizationQuery, getUserQuery } from "./query";
import { IUserAttributes, IUserUniqueAttributes } from "../../interfaces/user.interface";
import { checkUUIDv4, isUUIDv4 } from "../../helpers";
import { BadRequestError, InternalServerError } from "../../core/errors";

export async function getMembers(filter?: WhereOptions<IUserAttributes>, options?: IQueryOptions) {
  return (await getOrganizationQuery(filter, options).catch((err) => {
    throw new InternalServerError(err.errors?.[0]?.message || err.message);
  })) as (UserModel & IMemberDetails)[];
}

export async function findMemberById(memberId: string, isVerified = true) {
  checkUUIDv4(memberId);

  return await (<Promise<(UserModel & IMemberDetails) | null>>(
    getUserQuery(
      { id: memberId, role: USER.ROLE.MEMBER, isVerified },
      { includeOrganization: true, password: false }
    )
  ));
}

export async function findMemberByMemberId(memberId: string, isVerified = true) {
  checkUUIDv4(memberId);

  return await (<Promise<(UserModel & IMemberDetails) | null>>(
    getUserQuery(
      { orgId: memberId, role: USER.ROLE.MEMBER, isVerified },
      { includeOrganization: true, password: false }
    )
  ));
}

export async function findMemberByName(name: string, isVerified = true) {
  return (await UserModel.findOne({
    where: {
      isVerified: isVerified && true,
      role: USER.ROLE.MEMBER,
    },
    include: [
      {
        model: BalanceModel,
        as: "balance",
        attributes: ["rewardToken", "penaltyToken", "reputationToken"],
      },
      { model: MemberModel, as: "organization", where: { name } },
    ],
  })) as (UserModel & IMemberDetails) | null;
}

export async function findMemberByOptionalAttributes(
  filter: Partial<IUserUniqueAttributes>,
  isVerified = true
) {
  return await getUserQuery({
    [Op.or]: [{ id: filter.id }, { username: filter.username }, { email: filter.email }],
    role: USER.ROLE.MEMBER,
    isVerified,
  });
}

export async function createMember(attrs: IMemberCreationAttributes, transaction?: Transaction) {
  return await MemberModel.create(
    {
      ...attrs,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    },
    { transaction }
  );
}

export async function deleteMember(orgId: string, transaction?: Transaction) {
  return await MemberModel.destroy({ where: { id: orgId }, transaction });
}

export const OrganizationRepo = {
  getMembers,
  findMemberById,
  findMemberByMemberId,
  findMemberByName,
  findMemberByOptionalAttributes,
  createMember,
  deleteMember,
};
