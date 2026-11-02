# 02 — Networking and request routing

## Concepts

An **IP address** identifies a network interface; a **port** identifies a listening application endpoint. **DNS** maps a hostname to an IP address. **HTTP** defines requests and responses between browser and server. A **reverse proxy** receives requests and forwards them to an appropriate backend.

Our local hostname is `hawaii.home.arpa`; the Pi was accessed over the LAN at `192.168.1.33` during development. Local addressing may change with network configuration.

## A request's journey

1. The browser resolves the local hostname to a reachable server.
2. The reverse proxy accepts the HTTP request.
3. Static page requests are served by the web server.
4. `/api/...` requests reach Flask through configured routing.
5. Flask talks to PostgreSQL over the container network and returns JSON.

The exact proxy host rules and Docker network names must be verified in the live Nginx Proxy Manager and Compose configuration; they are not reproduced here.

## Useful distinction

`http://hawaii.home.arpa/admin.html` and `http://hawaii.home.arpa/api/memories` may look like paths on one website, but one serves HTML and the other executes backend code. A hostname alone does not tell you which process handles a request.

## Check yourself

1. What is the difference between DNS and a reverse proxy?
2. Why can multiple services run on one Raspberry Pi?
3. What does an HTTP 404 tell you? What *doesn't* it tell you?
