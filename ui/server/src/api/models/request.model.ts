import { DataTypes } from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { REQUEST, SWAG, USER } from "../constants";

const sequelize = pgInstance.getSequelize();

export const RequestModel = sequelize.define(
  REQUEST.MODEL_NAME,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true,
      autoIncrement: true,
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: USER.TABLE_NAME,
        key: "id",
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    swagId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SWAG.TABLE_NAME,
        key: "id",
      },
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: USER.TABLE_NAME,
        key: "id",
      },
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: REQUEST.TABLE_NAME,
  }
);
