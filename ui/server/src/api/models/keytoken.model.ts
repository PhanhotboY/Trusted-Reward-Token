import { DataTypes, Model } from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { KEYTOKEN, USER } from "../constants";

const sequelize = pgInstance.getSequelize();

export const KeyTokenModel = sequelize.define<
  Model<
    {
      userId: DataTypes.StringDataType;
      refreshToken: string;
      refreshTokensUsed: string;
      privateKey: string;
      publicKey: string;
    },
    {
      userId: string;
      refreshToken: string;
      refreshTokensUsed: string[];
      privateKey: string;
      publicKey: string;
    }
  >
>(
  KEYTOKEN.MODEL_NAME,
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
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshTokensUsed: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    privateKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: KEYTOKEN.TABLE_NAME,
  }
);
