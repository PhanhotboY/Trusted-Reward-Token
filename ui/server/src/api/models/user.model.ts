import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { USER } from "../constants";
import { OrganizationModel } from "./organization.model";
import { Unionize } from "../utils";
import { BalanceModel } from "./balance.model";

const sequelize = pgInstance.getSequelize();

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare firstName: string;
  declare lastName: string;
  declare password: string;
  declare email: string;
  declare phone: string;
  declare role: Unionize<typeof USER.ROLE>;
  declare title: string;
  declare orgId: ForeignKey<UserModel["id"]> | null;
  declare address: string;
  declare isVerified: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(USER.ROLE)),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: USER.TABLE_NAME,
    modelName: USER.MODEL_NAME,
    initialAutoIncrement: "1000",
    paranoid: true,
  }
);

UserModel.belongsTo(OrganizationModel, {
  targetKey: "id",
  foreignKey: "orgId",
  as: "organization",
  onDelete: "CASCADE",
});
UserModel.hasOne(BalanceModel, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "balance",
  onDelete: "CASCADE",
});
