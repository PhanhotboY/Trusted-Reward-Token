"use strict";
import { REASON, USER } from "../constants";
import { UserModel } from "../models";
import { Migration } from "../../db/init.postgresql";
import { DataTypes } from "sequelize";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn(REASON.TABLE_NAME, 'duration', {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  });
};

const down: Migration = async ({ context: queryInterface }) => { };

export { up, down };
