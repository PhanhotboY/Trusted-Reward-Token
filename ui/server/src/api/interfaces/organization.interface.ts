import { Attributes, CreationAttributes } from "sequelize";
import { OrganizationModel } from "../models";
import { IUserAttributes } from "./user.interface";
import { IBalanceAttributes } from "./balance.interface";

export interface IOrganizationAttributes extends Attributes<OrganizationModel> {}
export interface IOrganizationCreationAttributes extends CreationAttributes<OrganizationModel> {}

export interface IOrganizationDetails extends IUserAttributes {
  balance: IBalanceAttributes;
  organization: IOrganizationAttributes;
}
