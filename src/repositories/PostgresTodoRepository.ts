import { Pool } from "pg";
import { TodoItem } from "../models/todoItem";
import { ITodoRepository } from "./interfaces/ITodoRepository";

interface TodoRow {
  id: number;
  title: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export class PostgresTodoRepository implements ITodoRepository {
  constructor(private readonly db: Pool) {
  }
  
  async searchItems(query: string): Promise<TodoItem[]> {
    const searchQuery = `%${query}%`;
    return this.db.query<TodoRow>(
      `SELECT
          id,
          title,
          is_deleted AS "isDeleted",
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
        FROM todo_items
        WHERE title ILIKE $1 AND is_deleted = false
        ORDER BY id`,
      [searchQuery]
    ).then(result => result.rows);
  }

  async getAll(): Promise<TodoItem[]> {
    const { rows } = await this.db.query<TodoRow>(
      `SELECT
          id,
          title,
          is_deleted AS "isDeleted",
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
        FROM todo_items
        WHERE is_deleted = false
        ORDER BY id`
    );

    return rows;
  }

  async findById(id: number): Promise<TodoItem | null> {
    const { rows } = await this.db.query<TodoRow>(
      `SELECT
          id,
          title,
          is_deleted AS "isDeleted",
          created_at::text AS "createdAt",
          updated_at::text AS "updatedAt"
        FROM todo_items
        WHERE id = $1`,
      [id]
    );

    return rows[0] ?? null;
  }

  async add(title: string): Promise<TodoItem> {
    const { rows } = await this.db.query<TodoRow>(
      `INSERT INTO todo_items (title, is_deleted, created_at, updated_at)
       VALUES ($1, false, NOW(), NOW())
       RETURNING
          id,
          title,
          is_deleted AS "isDeleted",
         created_at::text AS "createdAt",
         updated_at::text AS "updatedAt"`,
      [title]
    );

    return rows[0];
  }

  async updateTitle(id: number, title: string): Promise<TodoItem | null> {
    const { rows } = await this.db.query<TodoRow>(
      `UPDATE todo_items
       SET title = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING
          id,
          title,
          is_deleted AS "isDeleted",
         created_at::text AS "createdAt",
         updated_at::text AS "updatedAt"`,
      [id, title]
    );

    return rows[0] ?? null;
  }

  async softDelete(id: number): Promise<TodoItem | null> {
    const { rows } = await this.db.query<TodoRow>(
      `UPDATE todo_items
       SET is_deleted = true, updated_at = NOW()
       WHERE id = $1
       RETURNING
          id,
          title,
          is_deleted AS "isDeleted",
         created_at::text AS "createdAt",
         updated_at::text AS "updatedAt"`,
      [id]
    );

    return rows[0] ?? null;
  }
}
