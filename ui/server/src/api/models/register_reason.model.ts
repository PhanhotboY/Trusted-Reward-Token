import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import { pgInstance } from "../../db/init.postgresql";
import { REGISTER_REASON } from "../constants";
import { UserModel, ReasonModel } from "../models";

const sequelize = pgInstance.getSequelize();

export class RegisterReasonModel extends Model<
  InferAttributes<RegisterReasonModel>,
  InferCreationAttributes<RegisterReasonModel>
> {
  declare userId: ForeignKey<UserModel["id"]>;
  declare reasonId: ForeignKey<ReasonModel["id"]>;
  declare deadline: Date;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RegisterReasonModel.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: REGISTER_REASON.MODEL_NAME,
    tableName: REGISTER_REASON.TABLE_NAME,
  }
);

RegisterReasonModel.belongsTo(UserModel, {
  targetKey: "id",
  foreignKey: "userId",
  as: "register-user",
});
RegisterReasonModel.hasOne(ReasonModel, {
  sourceKey: "reasonId",
  foreignKey: "id",
  as: "register-reason",
});
