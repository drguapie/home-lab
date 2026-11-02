# 06 — PostgreSQL and persistent data

## What is stored

Our `memories` table contains `id`, `title`, `location`, `memory_date`, `description`, and `image_path`. `image_path` refers to a file path; the image bytes are stored separately in the upload directory.

## SQL and CRUD

```sql
SELECT id, title, location, memory_date, description, image_path
FROM memories;
```

`SELECT` reads rows. `INSERT` creates, `UPDATE` changes, and `DELETE` removes rows. A `WHERE id = ...` condition is crucial when updating or deleting one memory: omitting a WHERE clause could affect every row.

## Parameterized queries

Server-side database code should use parameters instead of building SQL strings from user input. Parameters separate values from SQL syntax and reduce SQL injection risk.

## Transactions

A transaction groups database changes. `COMMIT` makes successful changes durable; `ROLLBACK` undoes an incomplete transaction. Photo files and database rows live in different storage systems, so they do not automatically roll back together. A failed update after a successful upload may leave an unused image file.

## Persistence and backups

A container can be recreated; persistent database storage must survive that recreation. Verify the Compose volume configuration and create a tested database backup procedure before relying on the site for irreplaceable memories. A Git repository is **not** a database backup.

## Check yourself

1. Why store an image path rather than the full image in this table?
2. Why is `WHERE` important in UPDATE and DELETE?
3. Why won't Git restore missing PostgreSQL records?
