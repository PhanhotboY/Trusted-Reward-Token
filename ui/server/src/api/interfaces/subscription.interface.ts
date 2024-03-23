import { Attributes, CreationAttributes } from "sequelize";
import { SubscriptionModel } from "../models";
import { IReasonAttributes } from "./reason.interface";
import { IUserAttributes } from "./user.interface";

export interface ISubscriptionAttributes extends Attributes<SubscriptionModel> {}
export interface ISubscriptionCreationAttributes extends CreationAttributes<SubscriptionModel> {}

export interface ISubscriptionDetails extends ISubscriptionAttributes {
  reason: IReasonAttributes;
  subscriber: IUserAttributes;
}
