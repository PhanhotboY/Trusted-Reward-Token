import { Attributes, CreationAttributes } from "sequelize";
import { ReasonModel } from "../models/reason.model";

export interface IReasonAttributes extends Attributes<ReasonModel> {}
export interface IReasonCreationAttributes extends CreationAttributes<ReasonModel> {}
