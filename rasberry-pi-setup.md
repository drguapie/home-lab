# Raspberry Pi 5 Initial Server Setup

## Objective

Install Raspberry Pi OS Lite and prepare the server for self-hosting and cybersecurity projects.

## Hardware

- Raspberry Pi 5
- 128 GB microSD card
- Ethernet connection
- USB keyboard
- HDMI monitor

## Operating System

- Raspberry Pi OS Lite (64-bit)
- Debian 13 (Trixie)

## Configuration

- Created user: ******
- Configured keyboard layout (US)
- Connected via Ethernet
- Static LAN address assigned by router (DHCP reservation planned)
- No desktop environment installed

## Installed Packages

- Docker
- Nginx
- Git
- Curl
- Vim
- Fastfetch

## Verification

- Docker service active
- Nginx service active
- Docker hello-world container executed successfully

## Lessons Learned

- Raspberry Pi Imager required administrator authentication.
- Raspberry Pi OS Lite is ideal for servers because it uses minimal resources.
- Docker can be installed directly from Docker's installation script.
- Linux services can be verified with `systemctl`.

## Next Steps

- Install Portainer
- Deploy Homepage
- Deploy Uptime Kuma
- Configure SSH
- Configure firewall
- Configure automatic updates
