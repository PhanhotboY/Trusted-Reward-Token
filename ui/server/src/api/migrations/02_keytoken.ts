"use strict";
import { KEYTOKEN } from "../constants";
import { KeyTokenModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(KEYTOKEN.TABLE_NAME, KeyTokenModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(KEYTOKEN.TABLE_NAME, { force: true });
};

export { up, down };
