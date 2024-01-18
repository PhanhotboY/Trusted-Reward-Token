"use strict";
import { USER } from "../constants";
import { UserModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(USER.TABLE_NAME, UserModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(USER.TABLE_NAME, { force: true });
};

export { up, down };
