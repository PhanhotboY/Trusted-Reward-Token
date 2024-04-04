import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { REASON } from "../constants";

const sequelize = pgInstance.getSequelize();

export class ReasonModel extends Model<
  InferAttributes<ReasonModel>,
  InferCreationAttributes<ReasonModel>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: CreationOptional<string>;
  declare value: number;
  declare duration: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ReasonModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: REASON.MODEL_NAME,
    tableName: REASON.TABLE_NAME,
  }
);
