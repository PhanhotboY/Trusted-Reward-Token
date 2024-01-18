import { Attributes, CreationAttributes } from "sequelize";
import { RequestModel } from "../models";

export interface IRequestAttributes extends Attributes<RequestModel> {}
export interface IRequestCreationAttributes extends CreationAttributes<RequestModel> {}
