"use strict";
import { MEMBER } from "../constants";
import { MemberModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable(MEMBER.TABLE_NAME, MemberModel.getAttributes());
};

const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable(MEMBER.TABLE_NAME, {
    force: true,
  });
};

export { up, down };
