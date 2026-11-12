# Hawaii Memories — Security Assessment

## 1. Project Overview

Hawaii Memories is a self-hosted web application running on a Raspberry Pi using Docker Compose.

The application allows visitors to view photographs and memories while providing administrative functionality for uploading, creating, editing, and deleting content.

### Technology Stack

- Raspberry Pi
- Docker and Docker Compose
- Nginx
- Nginx Proxy Manager
- Flask (Python)
- PostgreSQL 16
- HTTP Basic Authentication

## 2. Assessment Objective

Evaluate the application's existing security controls to determine whether unauthorized users can access administrative functionality.

The assessment focused on:

- Authentication enforcement
- API endpoint protection
- Docker port exposure
- Reverse proxy routing
- Public versus restricted file access

Testing was performed against the locally hosted application.

## 3. Application Architecture

The application uses the following request path:

Browser
   |
   v
Nginx Proxy Manager
   |
   v
Hawaii Web (Nginx)
   |
   +----> Static website files
   |
   +----> Flask API
              |
              v
          PostgreSQL

Nginx Proxy Manager forwards requests to the Hawaii Web container through the Raspberry Pi's port 8080.

The Hawaii Web container applies authentication rules before forwarding API requests to Flask.

## 4. Authentication Configuration

Nginx uses HTTP Basic Authentication with credentials stored in a password file.

The administrative dashboard requires authentication.

API requests using methods other than GET also require authentication.

Public GET requests remain accessible so visitors can view memories.

The Flask backend does not currently implement its own authentication mechanism.

Therefore, Nginx is an important security boundary for administrative operations.

## 5. Security Testing

### Test 1: Unauthorized Photo Upload

Command:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
-X POST http://localhost:8080/api/upload
```

Result: HTTP 401 Unauthorized

Assessment: PASS

Nginx rejected an upload request without authentication credentials.

### Test 2: Public Gallery Access

Command:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
http://localhost:8080/api/memories
```

Result: HTTP 200 OK

Assessment: PASS

Public visitors can retrieve memories without authentication.

### Test 3: Administrative HTTP Methods

Command:

```bash
for method in POST PUT DELETE; do
    curl -s -o /dev/null -w "$method: %{http_code}\n" \
        -X "$method" \
        http://localhost:8080/api/memories/999999
done
```

Results:

POST: 401 Unauthorized
PUT: 401 Unauthorized
DELETE: 401 Unauthorized

Assessment: PASS for the tested URL.

Nginx rejected unauthenticated requests using these methods.

Note: The POST test used an ID-specific URL rather than the actual memory-creation endpoint.

### Test 4: Public Photograph Access

Command:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
http://localhost:8080/uploads/3aa0cf2121d34a33b7ec9fb2be8419ac.jpeg
```

Result: HTTP 200 OK

Assessment: PASS

The web server successfully served an uploaded photograph.

### Test 5: Restricted File Access

Command:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
http://localhost:8080/uploads/test.txt
```

Result: HTTP 403 Forbidden

Assessment: PASS

Nginx denied access to a non-image path in the uploads directory.

### Test 6: Docker Port Exposure

Command:

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

Findings:

- Hawaii Web publishes port 8080.
- Flask exposes port 5000 internally but does not publish it to the host.
- PostgreSQL exposes port 5432 internally but does not publish it to the host.

Assessment: PASS for host port exposure.

The Flask API and PostgreSQL database are not directly published through Docker host ports.

## 6. Security Findings

### Confirmed Controls

1. HTTP Basic Authentication protects administrative requests through the tested Nginx entry point.
2. Public gallery requests remain accessible.
3. Uploaded JPEG photographs can be retrieved.
4. Non-image paths in the uploads directory are denied by Nginx.
5. Flask and PostgreSQL do not publish host ports.

### Remaining Security Considerations

**HTTP Transport Security**

The application is accessible through HTTP.

HTTP Basic Authentication does not encrypt credentials. HTTPS should be implemented before exposing administrative functionality beyond a trusted development environment.

**Shared Docker Network**

The Flask container is connected to the shared proxy network.

Other containers on that network may be able to communicate with Flask without passing through Hawaii Web's authentication controls.

Network isolation should be reviewed.

**Backend Authentication**

Flask currently relies on Nginx to enforce administrative authentication.

If Flask becomes accessible through another route, its administrative endpoints may be exposed.

**Additional Testing**

The exact POST /api/memories endpoint should be tested without credentials.

Authentication behavior should also be verified through the public-facing proxy hostname.

The assessment did not include comprehensive penetration testing.

## 7. Lessons Learned

This assessment demonstrated several important cybersecurity concepts:

- Authentication and authorization
- HTTP status code interpretation
- Reverse proxy security
- Docker network isolation
- API endpoint protection
- Allowlisting
- Security validation through controlled testing

A key lesson was that security controls should be tested rather than assumed to work based solely on configuration files.

## 8. Conclusion

The Hawaii Memories application successfully passed the authentication and access-control tests performed during this assessment.

The existing Nginx configuration provides a useful security boundary for administrative operations.

Further improvements should focus on HTTPS, Docker network isolation, and defense-in-depth authentication.

This assessment represents an initial security review rather than a complete security certification.
