import { Attributes, CreationAttributes } from "sequelize";

import { UserModel } from "../models";

export interface IUserAttributes extends Attributes<UserModel> {}
export interface IUserCreationAttributes extends CreationAttributes<UserModel> {}

export interface IUserJWTPayload {
  userId: IUserAttributes["id"];
  email: IUserAttributes["email"];
  role: IUserAttributes["role"];
}
