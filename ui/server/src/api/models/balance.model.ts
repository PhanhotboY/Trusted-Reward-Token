import { DataTypes } from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { BALANCE, USER } from "../constants";

const sequelize = pgInstance.getSequelize();

export const BalanceModel = sequelize.define(
  BALANCE.MODEL_NAME,
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: USER.TABLE_NAME,
        key: "id",
      },
    },
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
  },
  {
    tableName: BALANCE.TABLE_NAME,
  }
);
