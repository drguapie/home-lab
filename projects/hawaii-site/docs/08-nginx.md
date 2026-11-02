# 08 — Nginx and the reverse proxy

## Two related jobs

A **web server** can serve static files such as HTML, CSS, and JavaScript. A **reverse proxy** receives requests and forwards them to another server. Our environment uses an Nginx web container and Nginx Proxy Manager for local routing.

## Why this matters

The browser requests a page and later calls `/api/memories`. These requests may be handled by different containers even though the browser uses one hostname. Routing rules connect the public URL paths to the appropriate internal service.

## Troubleshooting approach

If HTML loads but memories don't, inspect the browser's Network tab: does `/api/memories` return JSON, a 404, a 502, or HTML? A 502 often suggests the proxy cannot reach an upstream; a 404 may mean a wrong route; a 500 suggests the backend failed. Check actual server logs before deciding which component is broken.

## Security caution

A reverse proxy does not automatically authenticate `/admin.html` or protect Flask write routes. Authentication and authorization must be configured deliberately, preferably enforced by the API itself.

## Check yourself

1. How is serving an HTML file different from proxying an API request?
2. Why might the homepage work while `/api/memories` fails?
3. Why is hiding `admin.html` not an access-control strategy?
