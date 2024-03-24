import { Sequelize } from "sequelize";
require("dotenv").config({ path: ".env.server" });

import { pgInstance } from "../src/db/init.postgresql";

async function testdb() {
  await pgInstance.connect();
  return pgInstance;
}

testdb()
  .then((instance) => {
    console.log("Connection has been established successfully.");
    instance.closeConnection();
  })
  .catch((err) => {
    console.log(err);
  });
