import { TodoItem } from "../models/todoItem";
import { PostgresPool } from "../db/postgresPool";
interface TodoRow {
  id: number;
  title: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

async function searchItems(query: string): Promise<TodoItem[]> {
  const db = PostgresPool;
  const searchQuery = `%${query}%`;
  return db
    .query<TodoRow>(
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
    )
    .then((result) => result.rows);
}

async function getAll(): Promise<TodoItem[]> {
  const db = PostgresPool;
  const { rows } = await db.query<TodoRow>(
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

async function findById(id: number): Promise<TodoItem | null> {
  const db = PostgresPool;
  const { rows } = await db.query<TodoRow>(
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

async function add(title: string): Promise<TodoItem> {
  const db = PostgresPool;
  const { rows } = await db.query<TodoRow>(
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

async function updateTitle(id: number, title: string): Promise<TodoItem | null> {
  const db = PostgresPool;
  const { rows } = await db.query<TodoRow>(
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

async function softDelete(id: number): Promise<TodoItem | null> {
  const db = PostgresPool;
  const { rows } = await db.query<TodoRow>(
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

export { searchItems, getAll, findById, add, updateTitle, softDelete };
