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
import { ReasonModel } from "./reason.model";

const sequelize = pgInstance.getSequelize();

export class RequestModel extends Model<
  InferAttributes<RequestModel>,
  InferCreationAttributes<RequestModel>
> {
  declare id: CreationOptional<string>;
  declare requesterId: ForeignKey<UserModel["id"]>;
  declare swagId: ForeignKey<SwagModel["id"]> | null;
  declare receiverId: ForeignKey<UserModel["id"]> | null;
  declare reasonId: ForeignKey<ReasonModel["id"]> | null;
  declare amount: number | null;
  declare type: Unionize<typeof REQUEST.TYPE>;
  declare message: string | null;
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
    reasonId: {
      type: DataTypes.UUID,
    },
    message: {
      type: DataTypes.TEXT,
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
    indexes: [
      {
        fields: ["requesterId"],
      },
      {
        fields: ["type", "status"],
      },
    ],
    modelName: REQUEST.MODEL_NAME,
    tableName: REQUEST.TABLE_NAME,
  }
);

RequestModel.belongsTo(UserModel, {
  targetKey: "id",
  foreignKey: "requesterId",
  as: "requester",
  onDelete: "CASCADE",
});
RequestModel.belongsTo(UserModel, { targetKey: "id", foreignKey: "receiverId", as: "receiver" });
RequestModel.belongsTo(SwagModel, { targetKey: "id", foreignKey: "swagId", as: "swag" });
RequestModel.belongsTo(ReasonModel, {
  targetKey: "id",
  foreignKey: "reasonId",
  as: "reason",
});
