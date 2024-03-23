import { Attributes, CreationAttributes } from "sequelize";
import { SwagModel } from "../models";

export interface ISwagAttributes extends Attributes<SwagModel> {}
export interface ISWagCreationAttributes extends CreationAttributes<SwagModel> {}
