import app from "./src/app";
import { pgInstance } from "./src/db/init.postgresql";

const port = process.env.PORT || 8080;

const server = app.listen(port, async () => {
  console.log(`Server listening on port ${port}: ${process.env.API_URL}`);
  await pgInstance.connect();
  const sequelize = pgInstance.getSequelize();
  await sequelize.sync();
});

process.on("SIGINT", () => cleanup("SIGINT"));
process.on("SIGTERM", () => cleanup("SIGTERM"));

async function cleanup(sig: string) {
  console.log(`Received kill signal: ${sig}, shutting down gracefully`);
  await pgInstance.closeConnection();
  server.close(() => {
    console.log("Closed out remaining connections");
  });
}
