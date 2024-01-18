import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { UserModel } from "./user.model";
import { ORGANIZATION } from "../constants";
import { pgInstance } from "../../db/init.postgresql";

const sequelize = pgInstance.getSequelize();

export class OrganizationModel extends Model<
  InferAttributes<OrganizationModel>,
  InferCreationAttributes<OrganizationModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare size: (typeof ORGANIZATION.SIZE)[keyof typeof ORGANIZATION.SIZE];
  declare location: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

OrganizationModel.init(
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
      type: DataTypes.ENUM(...Object.values(ORGANIZATION.SIZE)),
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
    tableName: ORGANIZATION.TABLE_NAME,
    modelName: ORGANIZATION.MODEL_NAME,
    initialAutoIncrement: "1000",
  }
);
