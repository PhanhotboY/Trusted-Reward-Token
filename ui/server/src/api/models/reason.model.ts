import { DataTypes } from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { REASON } from "../constants";

const sequelize = pgInstance.getSequelize();

export const ReasonModel = sequelize.define(
  REASON.MODEL_NAME,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: REASON.TABLE_NAME,
  }
);
