import app from "./src/app";
import { pgInstance } from "./src/db/init.postgresql";

const port = process.env.PORT || 8080;

const server = app.listen(port, async () => {
  console.log(`Server listening on port ${port}: ${process.env.API_URL}`);
  await pgInstance.connect();
});

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

async function cleanup() {
  console.log("Received kill signal, shutting down gracefully");
  await pgInstance.closeConnection();
  server.close(() => {
    console.log("Closed out remaining connections");
  });
}
