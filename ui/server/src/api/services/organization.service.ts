import bcrypt from "bcrypt";
import { Transaction, WhereOptions } from "sequelize";

import { BadRequestError, InternalServerError, NotFoundError } from "../core/errors";
import {
  IOrganizationCreationAttributes,
  IOrganizationDetails,
} from "../interfaces/organization.interface";
import {
  getOrganizations,
  findOrganizationById,
  createrOrganization,
  findUserById,
} from "../models/repositories";
import { getReturnArray, getReturnData } from "../utils";
import { getRequestListOfOrganization } from "./request.service";
import { IQueryOptions } from "../interfaces/query.interface";
import { findUserBy, getUser, getUserList, registerUser, updateUser } from "./user.service";
import { IUserCreationAttributes } from "../interfaces/user.interface";
import { USER } from "../constants";
import { pgInstance } from "../../db/init.postgresql";

const orgSensitiveFields: Array<keyof IOrganizationDetails> = [
  "createdAt",
  "updatedAt",
  "isVerified",
  "deletedAt",
  "password",
  "role",
];
const orgPublicFields: Array<keyof IOrganizationDetails> = [
  "id",
  "firstName",
  "lastName",
  "address",
  "email",
  "orgId",
  "title",
  "balance",
  "organization",
];

export async function getOrgList(
  filter: WhereOptions<IOrganizationDetails>,
  options: IQueryOptions
) {
  const orgList = await getOrganizations(filter, { ...options, exclude: orgSensitiveFields });

  return getReturnArray(orgList);
}

export async function getOrgDetails(orgId: string, isVerified = true) {
  const orgDetails = await findOrganizationById(orgId, isVerified);
  if (!orgDetails) throw new NotFoundError("Organization not found!");

  return getReturnData<IOrganizationDetails>(orgDetails, { excludes: orgSensitiveFields });
}

export async function getOrgRequestList(
  filter: { orgId: string; type: string; status: string },
  options: IQueryOptions
) {
  const orgRequestList = await getRequestListOfOrganization(filter, options);
  return getReturnArray(orgRequestList);
}

export async function getOrgEmployeeList(userId: string, options: IQueryOptions) {
  const user = await findUserById(userId, { role: USER.ROLE.ORGANIZATION });
  if (!user) throw new NotFoundError("Organization not found!");

  const employeeList = await getUserList({ orgId: user.orgId, role: USER.ROLE.EMPLOYEE }, options);

  console.log(employeeList);
  return getReturnArray(employeeList);
}

export async function getOrganization(orgId: string) {
  // throw new Error("Not implemented!");
  const orgDetails = await findOrganizationById(orgId);
  if (!orgDetails) throw new NotFoundError("Organization not found!");

  return getReturnData<IOrganizationDetails>(orgDetails, { fields: orgPublicFields });
}

export async function registerEmployee(userId: string, employeeId: string) {
  const orgDetails = await findUserById(userId, {
    includeOrganization: true,
    role: USER.ROLE.ORGANIZATION,
  });
  if (!orgDetails) throw new NotFoundError("Organization not found!");

  const employee = await getUser(employeeId);
  if (!employee) throw new NotFoundError("Employee not found!");

  const res = await updateUser(employeeId, { orgId: orgDetails.orgId });
  if (!res) throw new InternalServerError("Update employee failed!");

  return getReturnData(employee);
}

export async function registerOrganization(
  data: IOrganizationCreationAttributes & IUserCreationAttributes
) {
  const foundUser = await findUserBy(
    { email: data.email, username: data.username, address: data.address },
    false,
    false
  );
  if (foundUser) {
    if (foundUser.email === data.email) throw new BadRequestError("Email already registered!");
    if (foundUser.username === data.username)
      throw new BadRequestError("Username already existed!");
    if (foundUser.address === data.address)
      throw new BadRequestError("Address already registered!");
  }

  const sequelize = pgInstance.getSequelize();

  const org = await sequelize.transaction(async (transaction: Transaction) => {
    // create organization
    const org = await createrOrganization(data, transaction);
    console.log("organization: ", org.toJSON());
    // create user and balance
    const salt = bcrypt.genSaltSync();
    const hashedPwd = bcrypt.hashSync(data.password, salt);
    await registerUser(
      {
        ...data,
        role: USER.ROLE.ORGANIZATION,
        isVerified: false,
        orgId: org.id,
        password: hashedPwd,
      },
      transaction
    );

    return org;
  });

  return getOrgDetails(org.id, false);
}

export async function verifyOrg(orgId: string) {
  const orgDetails = await findOrganizationById(orgId, false);
  if (!orgDetails) throw new NotFoundError("Organization not found!");

  const res = await orgDetails.update({ isVerified: true });
  if (!res) throw new InternalServerError("Update organization failed!");

  return getReturnData(orgDetails, { excludes: orgSensitiveFields });
}

export async function removeEmployee(userId: string, employeeId: string) {
  const orgDetails = await findUserById(userId, {
    includeOrganization: true,
    role: USER.ROLE.ORGANIZATION,
  });
  if (!orgDetails) throw new NotFoundError("Organization not found!");

  const employee = await getUser(employeeId);
  if (!employee) throw new NotFoundError("Employee not found!");

  const res = await updateUser(employeeId, { orgId: null });
  if (!res) throw new InternalServerError("Update employee failed!");

  return getReturnData(employee);
}

export const OrgService = {
  getOrgList,
  getOrgDetails,
  getOrgRequestList,
  getOrgEmployeeList,
  getOrganization,
  registerEmployee,
  registerOrganization,
  verifyOrg,
  removeEmployee,
};
