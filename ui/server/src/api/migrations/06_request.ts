"use strict";
import { REQUEST } from "../constants";
import { RequestModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(REQUEST.TABLE_NAME, RequestModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(REQUEST.TABLE_NAME, { force: true });
};

export { up, down };
