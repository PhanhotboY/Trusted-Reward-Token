import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { Unionize } from "../utils";
import { REQUEST } from "../constants";
import { SwagModel } from "./swag.model";
import { UserModel } from "./user.model";
import { pgInstance } from "../../db/init.postgresql";

const sequelize = pgInstance.getSequelize();

export class RequestModel extends Model<
  InferAttributes<RequestModel>,
  InferCreationAttributes<RequestModel>
> {
  declare id: CreationOptional<string>;
  declare orgId: ForeignKey<UserModel["id"]>;
  declare swagId: ForeignKey<SwagModel["id"]> | null;
  declare receiverId: ForeignKey<UserModel["id"]> | null;
  declare amount: number | null;
  declare type: Unionize<typeof REQUEST.TYPE>;
  declare status: Unionize<typeof REQUEST.STATUS>;
  declare completedAt: Date | null;

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
    },
    completedAt: {
      type: DataTypes.DATE,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(REQUEST.TYPE)),
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.UUID,
    },
    swagId: {
      type: DataTypes.UUID,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(REQUEST.STATUS)),
      defaultValue: REQUEST.STATUS.PENDING,
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

RequestModel.belongsTo(UserModel, {
  targetKey: "id",
  foreignKey: "orgId",
  as: "requester",
  onDelete: "CASCADE",
});
RequestModel.belongsTo(UserModel, { targetKey: "id", foreignKey: "receiverId", as: "receiver" });
RequestModel.belongsTo(SwagModel, { targetKey: "id", foreignKey: "swagId", as: "requestSwag" });
