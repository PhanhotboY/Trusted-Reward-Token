"use strict";
import { REASON } from "../constants";
import { ReasonModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(REASON.TABLE_NAME, ReasonModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {};

export { up, down };
