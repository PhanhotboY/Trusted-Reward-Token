import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { BALANCE } from "../constants";
import { UserModel } from "./user.model";

const sequelize = pgInstance.getSequelize();

export class BalanceModel extends Model<
  InferAttributes<BalanceModel>,
  InferCreationAttributes<BalanceModel>
> {
  declare userId: ForeignKey<UserModel["id"]>;
  declare rewardToken: CreationOptional<number>;
  declare penaltyToken: CreationOptional<number>;
  declare reputationToken: CreationOptional<number>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BalanceModel.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    rewardToken: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    penaltyToken: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    reputationToken: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: BALANCE.MODEL_NAME,
    tableName: BALANCE.TABLE_NAME,
  }
);
