"use strict";
import { BALANCE } from "../constants";
import { BalanceModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(BALANCE.TABLE_NAME, BalanceModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(BALANCE.TABLE_NAME, { force: true });
};

export { up, down };
