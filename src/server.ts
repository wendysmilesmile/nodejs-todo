import { createApp } from "./app";
import { closePostgresPool } from "./db/postgresPool";

const app = createApp();
const port = Number(process.env.PORT ?? 3000);

const server = app.listen(port, () => {
  console.log(`ToDoService listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await closePostgresPool();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
