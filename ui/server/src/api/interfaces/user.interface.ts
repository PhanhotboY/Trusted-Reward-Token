import { Attributes, CreationAttributes } from "sequelize";

import { BalanceModel, UserModel } from "../models";
import { IBalanceAttributes } from "./balance.interface";

export interface IUserAttributes extends Attributes<UserModel> {}
export interface IUserCreationAttributes extends CreationAttributes<UserModel> {}
export interface IUserDetails extends IUserAttributes {
  balance: { reputationToken: IBalanceAttributes["reputationToken"] };
}

export interface IUserJWTPayload {
  userId: IUserAttributes["id"];
  email: IUserAttributes["email"];
  role: IUserAttributes["role"];
}

export interface IUserUniqueAttributes
  extends Pick<IUserAttributes, "id" | "email" | "username" | "address"> {}

export interface IUserResponse
  extends Pick<
    IUserDetails,
    | "id"
    | "username"
    | "firstName"
    | "lastName"
    | "address"
    | "email"
    | "phone"
    | "role"
    | "orgId"
    | "title"
    | "balance"
  > {}
