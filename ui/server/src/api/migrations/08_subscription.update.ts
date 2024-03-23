"use strict";
import { USER } from "../constants";
import { UserModel } from "../models";
import { Migration } from "../../db/init.postgresql";

/** @type {import('sequelize-cli').Migration} */

const up: Migration = async ({ context: queryInterface }) => {
  // Define the name of the foreign key constraint
  const constraintName = "subscriptions_userId_fkey";

  // First, drop the existing foreign key constraint
  await queryInterface.removeConstraint("subscriptions", constraintName);

  // Then, add the foreign key constraint with ON DELETE CASCADE
  await queryInterface.addConstraint("subscriptions", {
    fields: ["userId"],
    type: "foreign key",
    name: constraintName,
    references: {
      table: USER.TABLE_NAME,
      field: "id",
    },
    onDelete: "CASCADE", // This is what adds ON DELETE CASCADE
    onUpdate: "CASCADE",
  });
};

const down: Migration = async ({ context: queryInterface }) => {};

export { up, down };
