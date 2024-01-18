"use strict";
import { SWAG } from "../constants";
import { SwagModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(SWAG.TABLE_NAME, SwagModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(SWAG.TABLE_NAME, { force: true });
};

export { up, down };
