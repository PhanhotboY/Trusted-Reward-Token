"use strict";
import { SUBSCRIPTION } from "../constants";
import { SubscriptionModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(SUBSCRIPTION.TABLE_NAME, SubscriptionModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(SUBSCRIPTION.TABLE_NAME, { force: true });
};

export { up, down };
