import { Attributes, CreationAttributes } from "sequelize";

import { BalanceModel } from "../models";

export interface IBalanceAttributes extends Attributes<BalanceModel> {}
export interface IBalanceCreationAttributes extends CreationAttributes<BalanceModel> {}
