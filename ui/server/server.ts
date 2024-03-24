import app from "./src/app";
import { pgInstance } from "./src/db/init.postgresql";
import { provider } from "./src/db/init.jsonRpcProvider";

const port = process.env.PORT || 8080;

const server = app.listen(port, async () => {
  await pgInstance.connect();
  const sequelize = pgInstance.getSequelize();
  await sequelize.sync();
  console.log("block number:::::::", await provider.getBlockNumber());
  console.log(`Server listening on port ${port}: ${process.env.API_URL}`);
});

process.on("SIGINT", () => cleanup("SIGINT"));
process.on("SIGTERM", () => cleanup("SIGTERM"));
process.on("uncaughtException", () => cleanup("uncaughtException"));

async function cleanup(sig: string) {
  console.log(`Received kill signal: ${sig}, shutting down gracefully`);
  await pgInstance.closeConnection();
  server.close(() => {
    console.log("Closed out remaining connections");
  });
}
