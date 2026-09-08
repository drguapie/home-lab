# Hawaii Web Server

## Overview

Created a basic self-hosted website on the Raspberry Pi using Docker and Nginx. The website is currently available only on the local network.

## Docker Web Server

The website runs inside an Nginx Docker container.

Docker maps port 8080 on the Raspberry Pi to port 80 inside the container:

8080 -> 80

The website's `index.html` file is mounted into the container as a read-only bind mount.

## Local Name Resolution

The Ubuntu workstation uses the `/etc/hosts` file to resolve:

hawaii.home.arpa -> 192.168.1.33

This allows the website to be accessed using a hostname instead of the Raspberry Pi's IP address.

## Reverse Proxy

Nginx Proxy Manager receives requests for:

hawaii.home.arpa

and forwards them to:

192.168.1.33:8080

This allows the website to be accessed without manually specifying port 8080.

## Verification

The following checks were completed:

- Confirmed the Hawaii web container was running with `docker ps`.
- Verified local hostname resolution using `getent hosts hawaii.home.arpa`.
- Tested the HTTP response using `curl -I http://hawaii.home.arpa`.
- Successfully accessed the website from Firefox at `http://hawaii.home.arpa`.

## What I Learned

- A web server listens for HTTP requests and serves website files.
- Docker port mappings connect a host port to a container port.
- `/etc/hosts` can provide local hostname-to-IP mappings.
- Nginx Proxy Manager can route requests to different services based on hostname.
- `getent` can test hostname resolution.
- `curl` can test HTTP communication without relying on a web browser.
