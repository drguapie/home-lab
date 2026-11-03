# Hawaii Memories: Mobile Photo Upload Troubleshooting

## Objective

Enable direct photo uploads from an iPhone to a Raspberry Pi-hosted website over the local network.

## Technology Stack

- Raspberry Pi
- Docker and Docker Compose
- Nginx
- Flask (Python)
- PostgreSQL
- iPhone Safari

## Problem

The website's administrative interface loaded successfully on an iPhone, but uploading photographs resulted in a "Failed to upload photograph" error.

## Investigation

### 1. Verify Network Connectivity

The Raspberry Pi had multiple IP addresses because Docker creates virtual networks for its containers.

We identified the Raspberry Pi's LAN address and accessed the website through port 8080.

This confirmed that the iPhone could communicate with the Raspberry Pi.

### 2. Inspect Flask Logs

Command:

`docker logs --tail 20 hawaii-api`

The Flask application was running, but no new upload requests appeared in its logs.

This suggested that the requests were being blocked before reaching Flask.

### 3. Inspect Nginx Logs

Command:

`docker logs --tail 30 hawaii-web`

The logs revealed two errors:

**HTTP 413 — Content Too Large**

`POST /api/upload HTTP/1.1" 413`

Nginx rejected photographs exceeding its default request-body size limit.

**HTTP 404 — Not Found**

`GET /api/memories HTTP/1.1" 404`

Nginx attempted to locate the API endpoint as a static file rather than forwarding the request to Flask.

## Root Causes

1. Nginx's default upload limit was too small for iPhone photographs.
2. Nginx was not configured to forward API requests to the Flask backend.

## Solution

Created a custom Nginx configuration with:

```nginx
client_max_body_size 10M;

location /api/ {
    proxy_pass http://hawaii-api:5000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

Updated Docker Compose to mount the configuration into the Nginx container.

Separately, added `pillow-heif` support to Flask to recognize HEIF/HEIC photographs and convert them to JPEG.

Recreated the Nginx container to apply the configuration.

## Results

Successfully uploaded photographs directly from an iPhone to the Raspberry Pi-hosted website.

The existing mobile gallery interactions, including dragging photographs, also worked.

## Lessons Learned

- HTTP status codes help identify where requests fail.
- A 413 error indicates that a request exceeds an allowed size.
- A 404 error can indicate incorrect routing.
- Reverse proxies control how requests reach backend applications.
- Docker logs are valuable for troubleshooting communication between containers.
- Investigating the network path before modifying application code can prevent unnecessary changes.

## Future Improvements

- Add authentication to the administrative interface.
- Improve upload error messages.
- Test additional photograph formats and file sizes.
- Avoid exposing the unauthenticated admin interface to the public internet.
