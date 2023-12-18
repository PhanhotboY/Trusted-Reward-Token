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
    rewardToken: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    penaltyToken: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reputationToken: {
      type: DataTypes.INTEGER,
      allowNull: true,
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

BalanceModel.belongsTo(UserModel, { targetKey: "id", foreignKey: "userId", as: "balance" });
