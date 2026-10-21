import request from "supertest";
import { createApp } from "../src/app";
import { PostgresTodoRepository } from "../src/repositories/PostgresTodoRepository";
import { getPostgresPool } from "../src/db/postgresPool";
import { FakeTodoRepository } from "./helpers/FakeTodoRepository";

describe("Todo API", () => {
  const createTestApp = () => {
    // const repository = new PostgresTodoRepository(getPostgresPool());
    const repository = new FakeTodoRepository();
    return createApp({ todoRepository: repository });
  };

  it("GET /api/todo-items returns active items", async () => {
    const app = createTestApp();
    await request(app).post("/api/todo-item").send({ title: "do swimming" }).expect(201);

    const response = await request(app).get("/api/todo-items").expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("do swimming");
    expect(response.body[0].isDeleted).toBe(false);
  });

  it("POST /api/todo-item creates an item", async () => {
    const app = createTestApp();
    const response = await request(app)
      .post("/api/todo-item")
      .send({ title: "do swimming" })
      .expect(201);

    expect(response.body.id).toBe(1);
    expect(response.body.title).toBe("do swimming");
    expect(response.body.isDeleted).toBe(false);
  });

  it("PATCH /api/todo-item/:id updates title", async () => {
    const app = createTestApp();
    await request(app).post("/api/todo-item").send({ title: "do swimming" }).expect(201);

    const response = await request(app)
      .patch("/api/todo-item/1")
      .send({ title: "do swimming - updated" })
      .expect(200);

    expect(response.body.title).toBe("do swimming - updated");
  });

  it("DELETE /api/todo-item/:id soft-deletes item", async () => {
    const app = createTestApp();
    await request(app).post("/api/todo-item").send({ title: "do swimming" }).expect(201);

    await request(app).delete("/api/todo-item/1").expect(204);

    const response = await request(app).get("/api/todo-items").expect(200);
    expect(response.body).toHaveLength(0);
  });

  it("returns 400 when title is empty", async () => {
    const app = createTestApp();
    const response = await request(app).post("/api/todo-item").send({ title: "   " }).expect(400);
    expect(response.body.message).toBe("Title is required.");
  });
});
