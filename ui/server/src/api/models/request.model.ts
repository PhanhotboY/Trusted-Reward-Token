import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { REQUEST } from "../constants";
import { SwagModel } from "./swag.model";
import { UserModel } from "./user.model";

const sequelize = pgInstance.getSequelize();

export class RequestModel extends Model<
  InferAttributes<RequestModel>,
  InferCreationAttributes<RequestModel>
> {
  declare id: CreationOptional<string>;
  declare memberId: ForeignKey<UserModel["id"]>;
  declare amount: number;
  declare completedAt: CreationOptional<Date>;
  declare type: string;
  declare swagId: ForeignKey<SwagModel["id"]> | null;
  declare receiverId: ForeignKey<UserModel["id"]> | null;
  declare isCompleted: boolean;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RequestModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: REQUEST.MODEL_NAME,
    tableName: REQUEST.TABLE_NAME,
  }
);

RequestModel.belongsTo(UserModel, { targetKey: "id", foreignKey: "memberId", as: "requester" });
RequestModel.hasOne(UserModel, { sourceKey: "id", foreignKey: "receiverId", as: "receiver" });
RequestModel.hasOne(SwagModel, { sourceKey: "id", foreignKey: "swagId", as: "requestSwag" });
