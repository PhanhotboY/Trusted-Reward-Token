import { DataTypes } from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { SWAG } from "../constants";

const sequelize = pgInstance.getSequelize();

export const SwagModel = sequelize.define(
  SWAG.MODEL_NAME,
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrementIdentity: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(200),
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
    tableName: SWAG.TABLE_NAME,
  }
);
