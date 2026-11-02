# Hawaii Memories — My Home-Lab Learning Project

A personal, Raspberry Pi–hosted digital scrapbook that I built while learning Linux, networking, web development, databases, and Docker. This repository is both working code and a record of how I learned to connect the pieces.

> **Security status:** The public gallery is read-only in the interface, but the Flask write endpoints are **not authenticated yet**. The admin page is **not private or secure** merely because it lives at `admin.html`. Do not expose this app publicly until authentication, authorization, and deployment security are implemented and tested.

## What works today

- Public Polaroid-style gallery: browse memories and open photo/detail overlays.
- Admin interface: add, view, edit, and delete memories.
- Photo uploads (JPEG, PNG, WebP) and a Flask REST API.
- PostgreSQL persistence and Docker Compose deployment on a Raspberry Pi 5.
- Local hostname `hawaii.home.arpa` through a reverse proxy.

## Follow the learning journey

Start with [LEARNING_NOTES.md](LEARNING_NOTES.md), then follow the chapters in [docs/](docs/). Each chapter explains the concept, connects it to our project, and includes questions to check understanding. These notes document our **current understanding**; verify configuration-specific details against the live files before treating them as exact.

## Request path (conceptual)

```text
Browser (HTML/CSS/JavaScript)
   |  fetch('/api/memories')
   v
Web server / reverse-proxy routing
   |  /api/* request
   v
Flask REST API (Python)
   |  parameterized SQL
   v
PostgreSQL database
   |  memory records
   v
Flask JSON response -> JavaScript renders Polaroids
```

The reverse proxy, static web server, Flask API, and database have different jobs. See [networking](docs/02-networking.md), [Flask](docs/05-python-and-flask.md), [Docker](docs/07-docker.md), and [Nginx](docs/08-nginx.md).

## Project structure

```text
hawaii-site/
├── index.html            # public scrapbook
├── admin.html            # CRUD UI (not yet access-controlled)
├── css/style.css         # shared styling
├── backend/app.py        # Flask routes and database logic
├── backend/Dockerfile    # backend image build instructions
├── backend/requirements.txt
├── compose.yaml          # service definitions
├── README.md
├── LEARNING_NOTES.md
└── docs/                  # topic-by-topic learning guide
```

`.env`, `image/`, and `uploads/` are excluded from version control. Never commit secrets, personal photographs, or production database exports. A `.gitignore` rule does not untrack files already committed.

## Next milestones

1. Authenticate administrators and **authorize every write endpoint** (POST, PUT, DELETE, upload).
2. Test API behavior with unauthorized requests; add rate limits, CSRF strategy if cookie sessions are used, and production-safe configuration.
3. Create a separate sample-data CRUD demo for employers.
4. Improve responsive design, accessibility, backup/recovery, and documentation.
5. Eventually support multiple independently hosted websites and booking workflows without premature complexity.

## Recovery point

Working CRUD application committed locally as `bf6fc4a` (`Add full-stack CRUD functionality to Hawaii memories site`). Confirm that this commit was pushed before relying on GitHub as an off-device backup.
