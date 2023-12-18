import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { ROLE, USER } from "../constants";

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
  declare salt: string;
  declare email: string;
  declare role: CreationOptional<string>;
  declare orgId: ForeignKey<UserModel["id"]> | null;
  declare address: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
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
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    salt: {
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: USER.TABLE_NAME,
    modelName: USER.MODEL_NAME,
    initialAutoIncrement: "1000",
  }
);

UserModel.hasMany(UserModel, { sourceKey: "id", foreignKey: "orgId", as: "members" });
UserModel.belongsTo(UserModel, { targetKey: "id", foreignKey: "orgId", as: "organization" });
