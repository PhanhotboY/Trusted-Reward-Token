import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { SUBSCRIPTION } from "../constants";
import { UserModel, ReasonModel } from ".";

const sequelize = pgInstance.getSequelize();

export class SubscriptionModel extends Model<
  InferAttributes<SubscriptionModel>,
  InferCreationAttributes<SubscriptionModel>
> {
  declare userId: ForeignKey<UserModel["id"]>;
  declare reasonId: ForeignKey<ReasonModel["id"]>;
  declare deadline: Date;

  declare isCommitted: CreationOptional<boolean>;
  declare description: CreationOptional<string>;
  declare committedAt: CreationOptional<Date>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

SubscriptionModel.init(
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    reasonId: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isCommitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    committedAt: DataTypes.DATE,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    indexes: [
      {
        fields: ["isCommitted"],
      },
    ],
    modelName: SUBSCRIPTION.MODEL_NAME,
    tableName: SUBSCRIPTION.TABLE_NAME,
  }
);

SubscriptionModel.belongsTo(UserModel, {
  targetKey: "id",
  foreignKey: "userId",
  as: "subscriber",
  onDelete: "CASCADE",
});
SubscriptionModel.hasOne(ReasonModel, {
  sourceKey: "reasonId",
  foreignKey: "id",
  as: "reason",
});
