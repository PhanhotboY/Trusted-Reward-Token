import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres://admin:rewardsystem@localhost:5432/reward-system");

async function testdb() {
  await sequelize.authenticate();
}

testdb()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.log(err);
  });
