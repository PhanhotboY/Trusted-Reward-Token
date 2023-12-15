import { DataTypes } from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { ROLE, USER } from "../constants";

const sequelize = pgInstance.getSequelize();

export const UserModel = sequelize.define(
  USER.MODEL_NAME,
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      autoIncrementIdentity: true,
      primaryKey: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM(ROLE.ADMIN, ROLE.MEMBER, ROLE.EMPLOYEE),
      allowNull: false,
    },
    organization: {
      type: DataTypes.INTEGER,
      references: {
        model: USER.TABLE_NAME,
        key: "id",
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: USER.TABLE_NAME,
    initialAutoIncrement: "1000",
  }
);
