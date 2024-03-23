import { Attributes, CreationAttributes } from "sequelize";
import { KeyTokenModel } from "../models";

export interface IKeyTokenAttributes extends Attributes<KeyTokenModel> {}
export interface IKeyTokenCreationAttributes extends CreationAttributes<KeyTokenModel> {}
