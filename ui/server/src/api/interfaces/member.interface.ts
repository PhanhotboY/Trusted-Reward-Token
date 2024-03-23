import { Attributes, CreationAttributes } from "sequelize";
import { MemberModel } from "../models";
import { IUserAttributes } from "./user.interface";
import { IBalanceAttributes } from "./balance.interface";

export interface IMemberAttributes extends Attributes<MemberModel> {}
export interface IMemberCreationAttributes extends CreationAttributes<MemberModel> {}

export interface IMemberDetails extends IUserAttributes {
  balance: IBalanceAttributes;
  organization: IMemberAttributes;
}
