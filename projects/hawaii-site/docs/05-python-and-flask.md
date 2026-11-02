# 05 — Backend: Python and Flask

## Why a backend exists

The browser should not connect directly to PostgreSQL using database credentials. Flask acts as the server-side boundary: it receives requests, validates data, executes database operations, and returns responses.

Our backend code lives in `backend/app.py` and runs in the `hawaii-api` container.

## Routes

A Flask route associates an HTTP path and method with a Python function. Conceptual example:

```python
@app.route('/api/memories/<int:memory_id>', methods=['PUT'])
def update_memory(memory_id):
    # Validate input, update database, and return a response.
    ...
```

`<int:memory_id>` converts that path segment to an integer. A route being registered does not prove the function works or that it is authorized.

## Validation and errors

For an update, validate required title, optional date format, and allowed field types before writing to the database. Return appropriate status codes: 400 for invalid input, 404 when a memory doesn't exist, and 500 for unexpected server failures. Avoid exposing secrets or internal exception details to the browser.

## The rebuild lesson

`backend/app.py` is copied into a Docker image. Editing the file on the Pi and restarting the old container did not install the new route. We used:

```bash
docker compose up -d --build --no-deps hawaii-api
```

The route then appeared in the server's allowed methods.

## Check yourself

1. Why can't the browser safely hold PostgreSQL credentials?
2. What does Flask's route decorator do?
3. Why is input validation a backend responsibility?
