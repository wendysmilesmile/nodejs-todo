import { app } from "./app";
import { closePostgresPool } from "./db/postgresPool";

const expressApp = app();
const port = Number(process.env.PORT ?? 3000);

let server = expressApp.listen(port, () => {
  console.log(`ToDoService listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await closePostgresPool();
    process.exit(0);
  });
}

function start() {
  return server;
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export { start, shutdown };
