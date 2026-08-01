# Raspberry Pi 5 Initial Server Setup

## Objective

Prepare a Raspberry Pi 5 as a lightweight Linux server for my home lab, portfolio, and future self-hosted applications.

## Hardware

- Raspberry Pi 5
- 8 GB RAM
- Samsung EVO Plus 128 GB microSD
- Ethernet connection

## Operating System

- Raspberry Pi OS Lite (64-bit)
- Debian 13 (Trixie)

## Software Installed

- Docker
- Nginx
- Git
- Curl
- Vim
- Fastfetch

## Configuration

- Enabled SSH
- Configured GitHub SSH authentication
- Verified Docker installation with the `hello-world` container
- Verified Nginx service
- Remote administration using SSH from my Ubuntu workstation

## Lessons Learned

- Recovered from an EXT4 filesystem corruption by reinstalling Raspberry Pi OS.
- Configured SSH for secure remote administration.
- Connected GitHub using SSH keys instead of HTTPS passwords.
- Confirmed Docker and Nginx services are running correctly.

## Next Steps
# Raspberry Pi 5 Initial Server Setup

## Objective

Prepare a Raspberry Pi 5 as a lightweight Linux server for my home lab, portfolio, and future self-hosted applications.

## Hardware

- Raspberry Pi 5
- 8 GB RAM
- Samsung EVO Plus 128 GB microSD
- Ethernet connection

## Operating System

- Raspberry Pi OS Lite (64-bit)
- Debian 13 (Trixie)

## Software Installed

- Docker
- Nginx
- Git
- Curl
- Vim
- Fastfetch

## Configuration

- Enabled SSH
- Configured GitHub SSH authentication
- Verified Docker installation with the `hello-world` container
- Verified Nginx service
- Remote administration using SSH from my Ubuntu workstation

## Lessons Learned

- Recovered from an EXT4 filesystem corruption by reinstalling Raspberry Pi OS.
- Configured SSH for secure remote administration.
- Connected GitHub using SSH keys instead of HTTPS passwords.
- Confirmed Docker and Nginx services are running correctly.

## Next Steps

- Install Docker Compose
- Deploy a personal portfolio website
- Learn reverse proxy configuration
- Configure HTTPS
- Document additional services as they are deployed
- Install Docker Compose
- Deploy a personal portfolio website
- Learn reverse proxy configuration
- Configure HTTPS
- Document additional services as they are deployed

## Docker Monitoring

Deployed Uptime Kuma using Docker Compose to monitor the availability of services running in the home lab.

### Monitored Services

- Portainer web interface
- Nginx web server
- External internet connectivity

### Docker Configuration

Uptime Kuma uses:

- A dedicated Docker container
- A persistent Docker volume for monitor settings and history
- A dedicated Docker network
- Port 3001 for access from the local network

### Firewall Rule

Access to Uptime Kuma was limited to the local network:

```bash
sudo ufw allow from 192.168.1.0/24 to any port 3001 proto tcp

## Docker Monitoring

Deployed Uptime Kuma using Docker Compose to monitor the availability of services running in the home lab.

### Monitored Services

- Portainer web interface
- Nginx web server
- External internet connectivity

### Docker Configuration

Uptime Kuma uses:

- A dedicated Docker container
- A persistent Docker volume for monitor settings and history
- A dedicated Docker network
- Port 3001 for access from the local network

### Troubleshooting

The Nginx monitor initially appeared down because the monitor used HTTPS. The current Nginx installation serves HTTP on port 80 and has not yet been configured for TLS on port 443.

Changing the monitor URL from:

`https://192.168.1.33`

to:

`http://192.168.1.33`

resolved the issue.
