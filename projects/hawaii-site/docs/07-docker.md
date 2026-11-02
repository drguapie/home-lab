# 07 — Docker and Compose

## Image vs. container

An **image** is a packaged filesystem and startup configuration. A **container** is a running (or stopped) instance of an image. A **Dockerfile** defines how to build an image. **Compose** describes related services, their configuration, networking, and persistent storage.

Known services include `hawaii-web` (static web server), `hawaii-api` (Flask), and `hawaii-db` (PostgreSQL). The Pi also hosts Nginx Proxy Manager and other home-lab services.

## Commands we used

```bash
docker compose up -d --build --no-deps hawaii-api
```

`up` starts/creates the selected service; `-d` detaches; `--build` rebuilds its image; `--no-deps` avoids starting dependencies automatically. Run it from the directory containing `compose.yaml`, or specify the Compose file explicitly.

```bash
docker exec hawaii-api grep -n 'methods=["PUT"]' /app/app.py
```

`docker exec` runs a command inside an existing container. `grep -n` searches for matching text and prints line numbers. We used this to check whether the container contained the new Flask route. No match suggested the running container still had older code.

## Bind mounts vs. built code

Static HTML/CSS may be bind-mounted into the web container, so saving the source file changes what the server can read. Flask Python source is copied during image build in our current setup, so a rebuild is required after source edits. The distinction depends on the actual Compose and Dockerfile configuration.

## Check yourself

1. What is the difference between `restart` and `up --build`?
2. What does a volume protect that an image does not?
3. Why can two containers communicate without using the Pi's public-facing port?
