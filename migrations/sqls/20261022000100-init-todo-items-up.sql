CREATE TABLE IF NOT EXISTS todo_items (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_todo_items_is_deleted ON todo_items (is_deleted);
