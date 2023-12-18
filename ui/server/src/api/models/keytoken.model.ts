import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { KEYTOKEN } from "../constants";
import { UserModel } from "./user.model";

const sequelize = pgInstance.getSequelize();

export class KeyTokenModel extends Model<
  InferAttributes<KeyTokenModel>,
  InferCreationAttributes<KeyTokenModel>
> {
  declare userId: ForeignKey<UserModel["id"]>;
  declare refreshToken: string;
  declare refreshTokensUsed: CreationOptional<string[]>;
  declare privateKey: string;
  declare publicKey: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

KeyTokenModel.init(
  {
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refreshTokensUsed: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
    privateKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publicKey: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: KEYTOKEN.TABLE_NAME,
    modelName: KEYTOKEN.MODEL_NAME,
  }
);

KeyTokenModel.belongsTo(UserModel, { targetKey: "id", foreignKey: "userId", as: "keytoken" });
