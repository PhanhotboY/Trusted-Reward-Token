import bcrypt from "bcrypt";
import { Sequelize, Transaction, WhereOptions } from "sequelize";

import { MEMBER, USER } from "../constants";
import { checkUUIDv4, isUUIDv4 } from "../helpers";
import { getRequestList } from "./request.service";
import { pgInstance } from "../../db/init.postgresql";
import { getReturnArray, getReturnData } from "../utils";
import { IQueryOptions } from "../interfaces/query.interface";
import {
  IUserAttributes,
  IUserCreationAttributes,
  IUserDetails,
} from "../interfaces/user.interface";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../core/errors";
import { IMemberCreationAttributes, IMemberDetails } from "../interfaces/member.interface";
import {
  deleteUser,
  findUserBy,
  getUser,
  getUserDetails,
  getUserList,
  registerUser,
  updateUser,
} from "./user.service";
import {
  getMembers,
  findMemberById,
  findMemberByName,
  findUserById,
  createMember,
  deleteMember,
  findMemberByMemberId,
} from "../models/repositories";
import { DIDRegistryContract, TokenClaimsIssuerContract } from "../contracts";
import { getHDNodeWallet, getRootHDNodeWallet } from "../utils/hdWallet";
import { getReasonSubscriptionList } from "./reason.service";
import { ISubscriptionAttributes } from "../interfaces/subscription.interface";
import { parseEther } from "ethers";

const memberSensitiveFields: Array<keyof IMemberDetails> = [
  "updatedAt",
  "isVerified",
  "deletedAt",
  "password",
  "role",
];
const memberPublicFields: Array<keyof IMemberDetails> = [
  "id",
  "fullName",
  "email",
  "orgId",
  "balance",
  "organization",
];

export async function getMemberList(filter: WhereOptions<IMemberDetails>, options: IQueryOptions) {
  const orgList = await getMembers(filter, { ...options, exclude: memberSensitiveFields });

  return getReturnArray(orgList);
}

export async function getMemberDetails(memberId: string, isVerified = true) {
  const memberDetails = await findMemberById(memberId, isVerified);
  if (!memberDetails) throw new BadRequestError("Member not found!");

  return getReturnData<IMemberDetails>(memberDetails, { excludes: memberSensitiveFields });
}

export async function getMemberRequestList(
  filter: { requesterId: string; type?: string; status?: string } & IQueryOptions
) {
  const orgRequestList = await getRequestList(filter);
  return getReturnArray(orgRequestList);
}

export async function getMemberEmployeeList(memberId: string, options?: IQueryOptions) {
  const member = await findMemberByMemberId(memberId);
  if (!member) throw new BadRequestError("Member not found!");

  const employeeList = await getUserList(
    { orgId: member.orgId, role: USER.ROLE.EMPLOYEE },
    options
  );

  return getReturnArray(employeeList);
}

export async function getMember(memberId: string) {
  const memberDetails = await (isUUIDv4(memberId)
    ? findMemberById(memberId)
    : findMemberByName(memberId));

  if (!memberDetails) throw new BadRequestError("Member not found!");

  return getReturnData<IMemberDetails>(memberDetails, { fields: memberPublicFields });
}

export async function getMemberSubscriptionList(
  memberId: string,
  filter?: Partial<ISubscriptionAttributes>
) {
  const subscriptions = await getReasonSubscriptionList(memberId, filter);

  return getReturnArray(subscriptions);
}

export async function registerEmployee(memberId: string, data: IUserCreationAttributes) {
  checkUUIDv4(memberId);
  const member = await findMemberById(memberId);
  if (!member) throw new UnauthorizedError("Member not found!");

  const foundUser = await findUserBy({ email: data.email, username: data.username }, true, false);
  if (foundUser) {
    if (foundUser.email === data.email) throw new BadRequestError("Email already registered!");
    if (foundUser.username === data.username)
      throw new BadRequestError("Username already existed!");
  }

  const sequelize = pgInstance.getSequelize();
  const employee = await sequelize.transaction(async (transaction: Transaction) => {
    const salt = bcrypt.genSaltSync();
    const hashedPwd = bcrypt.hashSync(data.password, salt);

    const employee = await registerUser(
      {
        ...data,
        role: USER.ROLE.EMPLOYEE,
        orgId: member.orgId,
        isVerified: true,
        password: hashedPwd,
      },
      transaction
    );

    if (!employee) throw new InternalServerError("Fail to register new employee!");

    try {
      const employeeWallet = getHDNodeWallet(employee.hdWalletIndex);
      const memberWallet = getHDNodeWallet(member.hdWalletIndex);
      const didRegistry = DIDRegistryContract(memberWallet);

      const validity = 365 * 24 * 60 * 60;
      const tx = await didRegistry.addDelegate(
        memberWallet.address,
        MEMBER.DID_DELEGATE_TYPE,
        employeeWallet.address,
        validity
      );
      await tx.wait();

      const delegates = await didRegistry.validDelegate(
        memberWallet.address,
        MEMBER.DID_DELEGATE_TYPE,
        employeeWallet.address
      );
      console.log("delegates: ", delegates);

      return employee;
    } catch (error) {
      console.log("error: ", error);
      throw new InternalServerError("Fail to set claim for member!");
    }
  });

  return getUserDetails(employee.id);
}

export async function registerMember(data: IMemberCreationAttributes & IUserCreationAttributes) {
  const foundUser = await findUserBy({ email: data.email, username: data.username }, true, false);
  if (foundUser) {
    if (foundUser.email === data.email) throw new BadRequestError("Email already registered!");
    if (foundUser.username === data.username)
      throw new BadRequestError("Username already existed!");
  }

  const sequelize = pgInstance.getSequelize();

  const member = await sequelize.transaction(async (transaction: Transaction) => {
    // create organization
    const org = await createMember(data, transaction);

    // create user and balance
    const salt = bcrypt.genSaltSync();
    const hashedPwd = bcrypt.hashSync(data.password, salt);

    const user = await registerUser(
      {
        ...data,
        role: USER.ROLE.MEMBER,
        isVerified: true,
        orgId: org.id,
        password: hashedPwd,
      },
      transaction
    );

    if (!user) {
      throw new InternalServerError("Fail to register new member!");
    }

    try {
      const wallet = getHDNodeWallet(user.hdWalletIndex);
      const adminWallet = getRootHDNodeWallet();
      const claimsIssuer = TokenClaimsIssuerContract(adminWallet);

      const tx = await claimsIssuer.setMembershipClaim(wallet.address);
      adminWallet.sendTransaction({
        to: wallet.address,
        value: parseEther("0.3"),
      });
      await tx.wait();
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      throw new InternalServerError("Fail to set claim for member!");
    }

    return user;
  });

  return getMemberDetails(member.id, true);
}

export async function verifyMember(orgId: string) {
  checkUUIDv4(orgId);

  const orgDetails = await findMemberById(orgId, false);
  if (!orgDetails) throw new BadRequestError("Member not found!");

  const res = await orgDetails.update({ isVerified: true });
  if (!res) throw new InternalServerError("Update organization failed!");

  return getReturnData(orgDetails, { excludes: memberSensitiveFields });
}

export async function removeEmployee(memberId: string, employeeId: string) {
  const member = await findMemberById(memberId);
  if (!member) throw new BadRequestError("Member not found!");

  const employee = await getUserDetails(employeeId);
  if (!employee) throw new NotFoundError("Employee not found!");

  const sequelize = pgInstance.getSequelize();

  await sequelize.transaction(async (transaction) => {
    try {
      await deleteUser(employeeId, transaction);
      const employeeWallet = getHDNodeWallet(employee.hdWalletIndex);
      const memberWallet = getHDNodeWallet(member.hdWalletIndex);
      const didRegistry = DIDRegistryContract(memberWallet);

      const tx = await didRegistry.revokeDelegate(
        memberWallet.address,
        MEMBER.DID_DELEGATE_TYPE,
        employeeWallet.address
      );
      await tx.wait();
    } catch (error) {
      console.log("error: ", error);
      await transaction.rollback();
      throw new InternalServerError("Fail to revoke delegate for member!");
    }
  });

  return true;
}

export const removeMember = async (memberId: string) => {
  checkUUIDv4(memberId);

  const member = await findMemberById(memberId);
  if (!member) throw new BadRequestError("Member not found!");

  const sequelize = pgInstance.getSequelize();
  await sequelize.transaction(async (transaction) => {
    try {
      await deleteMember(member.orgId!, transaction);
      const adminWallet = getRootHDNodeWallet();
      const memberWallet = getHDNodeWallet(member.hdWalletIndex);
      const claimsIssuer = TokenClaimsIssuerContract(adminWallet);

      const owner = await claimsIssuer.owner();
      console.log(owner);
      const tx = await claimsIssuer.revokeMembershipClaim(memberWallet.address);
      await tx.wait();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw new InternalServerError("Delete member failed!");
    }
  });

  return getReturnData(member);
};

export const MemberService = {
  getMemberList,
  getMemberDetails,
  getMemberRequestList,
  getMemberEmployeeList,
  getMember,
  getMemberSubscriptionList,
  registerEmployee,
  registerMember,
  verifyMember,
  removeEmployee,
  removeMember,
};
