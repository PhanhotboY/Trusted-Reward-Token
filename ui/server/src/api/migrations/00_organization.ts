"use strict";
import { ORGANIZATION } from "../constants";
import { OrganizationModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(ORGANIZATION.TABLE_NAME, OrganizationModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(ORGANIZATION.TABLE_NAME, {
    force: true,
  });
};

export { up, down };
