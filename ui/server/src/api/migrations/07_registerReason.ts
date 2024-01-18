"use strict";
import { REGISTER_REASON } from "../constants";
import { RegisterReasonModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(REGISTER_REASON.TABLE_NAME, RegisterReasonModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(REGISTER_REASON.TABLE_NAME, { force: true });
};

export { up, down };
