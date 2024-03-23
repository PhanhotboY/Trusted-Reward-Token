import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { UserModel } from "./user.model";
import { MEMBER } from "../constants";
import { pgInstance } from "../../db/init.postgresql";

const sequelize = pgInstance.getSequelize();

export class MemberModel extends Model<
  InferAttributes<MemberModel>,
  InferCreationAttributes<MemberModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare size: (typeof MEMBER.SIZE)[keyof typeof MEMBER.SIZE];
  declare location: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MemberModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    size: {
      type: DataTypes.ENUM(...Object.values(MEMBER.SIZE)),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: MEMBER.TABLE_NAME,
    modelName: MEMBER.MODEL_NAME,
    initialAutoIncrement: "1000",
  }
);
