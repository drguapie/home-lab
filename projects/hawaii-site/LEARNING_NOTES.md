# Learning Notes — How I Built Hawaii Memories

## My goal

I am using a real Raspberry Pi home lab to learn how software runs in production-like environments. Rather than memorize commands, I want to understand the system well enough to diagnose problems myself.

## The big picture

- **Linux** provides the operating system, filesystem, processes, permissions, and networking tools.
- **Docker Compose** defines and starts related services.
- **Nginx** serves static website files; a reverse proxy routes browser traffic to the correct service.
- **HTML** provides structure, **CSS** provides appearance, and **JavaScript** provides interaction.
- **Flask** receives API requests, validates input, and executes server-side Python.
- **PostgreSQL** stores memory records; uploaded image files are stored separately.
- **Git** tracks code changes; **GitHub** can store an off-device copy of committed work.

## Milestones and lessons

### 1. Public scrapbook and admin dashboard

We separated the public `index.html` from `admin.html`. The public page displays memories without edit/delete controls. The admin page can create, edit, and delete records. **Important:** UI separation is not a security boundary. A client can call an API without using our HTML buttons.

### 2. Full CRUD

- **Create:** `POST /api/memories` inserts a record.
- **Read:** `GET /api/memories` retrieves records.
- **Update:** `PUT /api/memories/<id>` changes a record.
- **Delete:** `DELETE /api/memories/<id>` removes a record.
- **Upload:** `POST /api/upload` stores a validated image and returns its path.

A browser action becomes an HTTP request, then Flask code, then a database operation. The page refreshes its rendered list after a successful write.

### 3. Debugging the missing PUT route

We added the Flask PUT route, and Python syntax checking passed, but the running service still reported only DELETE/OPTIONS for the route. The code on disk was newer than the code inside the running Docker image. Restarting the container alone reused the old image.

We rebuilt the backend service:

```bash
docker compose up -d --build --no-deps hawaii-api
```

- `docker compose`: operate on the Compose project.
- `up`: create/start services as needed.
- `-d`: run in the background.
- `--build`: rebuild the image before starting.
- `--no-deps`: do not start linked dependency services as part of this command.
- `hawaii-api`: target only that service.

After rebuilding, the server recognized PUT. **Diagnosis:** a successful source edit does not guarantee the running process uses the edited code.

### 4. Saving code with Git

The live site lives under `~/docker/hawaii-site`; the Git-tracked copy is under `~/home-lab/projects/hawaii-site`. We used `rsync` to copy application files, excluding `.env`, images, uploads, and backups. We reviewed `git status` and `git diff --cached --stat` before committing.

One mistake we caught: `rsync` overwrote the repository's `.gitignore`, removing `image/` and `uploads/`. We restored the committed ignore file before making commit `bf6fc4a`. **Lesson:** always inspect staged changes, even when a copy command succeeds.

### 5. Security work still to do

A page called `admin.html` is not automatically protected. Every server-side write route needs an authorization check. Keep the project on trusted local access until we implement and test security.

## How to study these notes

1. Pick a chapter in `docs/`.
2. Find the corresponding file or container in your live project.
3. Explain the request flow in your own words before running commands.
4. Make one small change, predict the outcome, test it, and record what happened.
5. Add new troubleshooting entries with **symptom → hypothesis → test → result → lesson**.

## Topics index

[Linux](docs/01-linux-and-raspberry-pi.md) · [Networking](docs/02-networking.md) · [Frontend](docs/03-frontend.md) · [JavaScript and APIs](docs/04-javascript-and-apis.md) · [Flask](docs/05-python-and-flask.md) · [PostgreSQL](docs/06-postgresql.md) · [Docker](docs/07-docker.md) · [Nginx](docs/08-nginx.md) · [Git](docs/09-git-and-github.md) · [Security](docs/10-security.md) · [Troubleshooting](docs/11-troubleshooting.md)
