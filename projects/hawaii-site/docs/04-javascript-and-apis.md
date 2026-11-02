# 04 — JavaScript, fetch, JSON, and REST

## Reading data

```javascript
const response = await fetch('/api/memories');
if (!response.ok) throw new Error('Could not load memories');
const data = await response.json();
```

`fetch` makes an HTTP request. Without an explicit method, it uses GET. `await` waits for a Promise to settle. `response.ok` is true for successful HTTP statuses (200–299). `.json()` parses a JSON response body into JavaScript data.

## Writing data

```javascript
await fetch(`/api/memories/${memory.id}`, {
  method: 'PUT',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(updatedMemory)
});
```

`PUT` requests an update to a specific resource. `JSON.stringify` converts a JavaScript object into a JSON string for the request body. The server decides whether the request is valid and permitted.

## CRUD mapping

| Action | HTTP method | Project endpoint |
|---|---|---|
| Create | POST | `/api/memories` |
| Read | GET | `/api/memories` |
| Update | PUT | `/api/memories/<id>` |
| Delete | DELETE | `/api/memories/<id>` |
| Upload | POST | `/api/upload` |

Uploads use `FormData` rather than a JSON body. The API returns an `image_path` which the memory record can reference.

## Important nuance

A successful HTTP request is not necessarily a successful application operation. Check status codes and response bodies; handle errors. Likewise, hiding a button cannot stop someone from sending an HTTP request directly.

## Check yourself

1. Why is `JSON.stringify` needed in the PUT example?
2. What is the difference between GET and POST?
3. What happens if a photo upload succeeds but the following memory update fails?
