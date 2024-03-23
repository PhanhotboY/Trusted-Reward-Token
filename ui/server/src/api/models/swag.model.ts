import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { SWAG } from "../constants";

const sequelize = pgInstance.getSequelize();

export class SwagModel extends Model<
  InferAttributes<SwagModel>,
  InferCreationAttributes<SwagModel>
> {
  declare id: string;
  declare name: string;
  declare description: CreationOptional<string>;
  declare value: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SwagModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: SWAG.MODEL_NAME,
    tableName: SWAG.TABLE_NAME,
  }
);
