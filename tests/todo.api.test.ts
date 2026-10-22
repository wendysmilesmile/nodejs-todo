import request from "supertest";
import { app } from "../src/app";
import * as todoService from "../src/services/TodoService";
import { httpError } from "../src/types/httpError";

jest.mock("../src/services/TodoService", () => ({
  searchItems: jest.fn(),
  getActiveItems: jest.fn(),
  addItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn()
}));

describe("Todo API", () => {
  const server = app();

  const mockedTodoService = jest.mocked(todoService);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/todo-items returns active items", async () => {
    mockedTodoService.getActiveItems.mockResolvedValue([
      {
        id: 1,
        title: "do swimming",
        isDeleted: false,
        createdAt: "2026-10-22T00:00:00.000Z",
        updatedAt: "2026-10-22T00:00:00.000Z"
      }
    ]);

    const response = await request(server).get("/api/todo-items").expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe("do swimming");
    expect(response.body[0].isDeleted).toBe(false);
    expect(mockedTodoService.getActiveItems).toHaveBeenCalledTimes(1);
  });

  it("POST /api/todo-item creates an item", async () => {
    mockedTodoService.addItem.mockResolvedValue({
      id: 1,
      title: "do swimming",
      isDeleted: false,
      createdAt: "2026-10-22T00:00:00.000Z",
      updatedAt: "2026-10-22T00:00:00.000Z"
    });

    const response = await request(server)
      .post("/api/todo-item")
      .send({ title: "do swimming" })
      .expect(201);

    expect(response.body.id).toBe(1);
    expect(response.body.title).toBe("do swimming");
    expect(response.body.isDeleted).toBe(false);
    expect(mockedTodoService.addItem).toHaveBeenCalledWith("do swimming");
  });

  it("PATCH /api/todo-item/:id updates title", async () => {
    mockedTodoService.updateItem.mockResolvedValue({
      id: 1,
      title: "do swimming - updated",
      isDeleted: false,
      createdAt: "2026-10-22T00:00:00.000Z",
      updatedAt: "2026-10-22T00:00:01.000Z"
    });

    const response = await request(server)
      .patch("/api/todo-item/1")
      .send({ title: "do swimming - updated" })
      .expect(200);

    expect(response.body.title).toBe("do swimming - updated");
    expect(mockedTodoService.updateItem).toHaveBeenCalledWith(1, "do swimming - updated");
  });

  it("DELETE /api/todo-item/:id returns 204", async () => {
    mockedTodoService.deleteItem.mockResolvedValue();

    await request(server).delete("/api/todo-item/1").expect(204);
    expect(mockedTodoService.deleteItem).toHaveBeenCalledWith(1);
  });

  it("PATCH /api/todo-item/:id returns 404 when service throws not found", async () => {
    mockedTodoService.updateItem.mockRejectedValue(httpError("Todo item not found.", 404));

    const response = await request(server)
      .patch("/api/todo-item/999")
      .send({ title: "x" })
      .expect(404);

    expect(response.body.message).toBe("Todo item not found.");
  });

  it("returns 400 when title is empty", async () => {
    const response = await request(server).post("/api/todo-item").send({ title: "   " }).expect(400);
    expect(response.body.message).toBe("Title is required.");
    expect(mockedTodoService.addItem).not.toHaveBeenCalled();
  });
});
