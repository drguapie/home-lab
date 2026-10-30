# Raspberry Pi Home Lab — Backup and Recovery

## 1. Overview

The Raspberry Pi hosts a Hawaii memories website using Docker.

The website has three important components:

- Website source code
- PostgreSQL database containing memories
- Uploaded photographs

We protect these using GitHub and automated backups stored on two computers.

## 2. Backup Architecture

```text
GitHub
  └── Website source code

Raspberry Pi (192.168.1.33)
  ├── Docker containers
  ├── PostgreSQL database
  ├── Website photographs
  └── Daily backups at 3:00 AM
             |
             | SSH + rsync
             v
Ubuntu OptiPlex
  └── Daily backup transfers at 4:00 AM
```

Both computers use the Pacific/Honolulu time zone.

## 3. Raspberry Pi Backups

Backup script:

`/home/joe/docker/backups/scripts/backup-hawaii.sh`

Backup location:

`/home/joe/docker/backups/hawaii-site/`

Each timestamped backup directory contains:

- `database.sql` — PostgreSQL database export
- `photos.tar.gz` — Archive containing the `image/` and `uploads/` directories

The script runs automatically using cron at 3:00 AM.

To view the schedule on the Raspberry Pi:

```bash
crontab -l
```

To manually create a backup:

```bash
bash ~/docker/backups/scripts/backup-hawaii.sh
```

The backup script keeps the seven newest completed timestamped backups on the Pi.

## 4. Ubuntu OptiPlex Backups

The OptiPlex retrieves backups from the Raspberry Pi using SSH and rsync.

Transfer script:

`/home/thetopshottah/scripts/pull-pi-backups.sh`

Backup destination:

`/home/thetopshottah/Backups/raspberry-pi/hawaii-site/`

The transfer runs daily at 4:00 AM using a systemd user timer.

Service:

`~/.config/systemd/user/pi-backup.service`

Timer:

`~/.config/systemd/user/pi-backup.timer`

To check the timer:

```bash
systemctl --user list-timers --all
```

To manually run the transfer:

```bash
systemctl --user start pi-backup.service
```

To check whether it succeeded:

```bash
systemctl --user status pi-backup.service
```

A successful oneshot service may show `inactive (dead)` with `status=0/SUCCESS`.

The OptiPlex retains older backups because the transfer does not use rsync's `--delete` option.

If the OptiPlex is powered off during the scheduled transfer, the persistent timer can catch up when the user's systemd manager starts again.

## 5. SSH Authentication

The OptiPlex connects to the Raspberry Pi using SSH key authentication.

OptiPlex private key:

`~/.ssh/id_ed25519`

OptiPlex public key:

`~/.ssh/id_ed25519.pub`

Raspberry Pi authorized keys:

`/home/joe/.ssh/authorized_keys`

Never upload private SSH keys, passwords, or `.env` files to GitHub.

## 6. Checking Backup Health

On the Raspberry Pi, inspect the available backups:

```bash
ls -lh ~/docker/backups/hawaii-site/
```

On the OptiPlex, inspect the copied backups:

```bash
ls -lh ~/Backups/raspberry-pi/hawaii-site/
```

Check that the latest timestamped backup directory contains both:

- `database.sql`
- `photos.tar.gz`

A backup should not be considered reliable solely because its files exist. Periodically test restoring the database and extracting the photograph archive.

## 7. Recovery Overview

If the Raspberry Pi's storage fails:

1. Reinstall the Raspberry Pi operating system.
2. Reinstall Docker and restore the Docker Compose configuration.
3. Retrieve the Hawaii website source code from GitHub.
4. Copy the latest verified database and photograph backups from the OptiPlex.
5. Restore the PostgreSQL database from `database.sql`.
6. Extract `photos.tar.gz` into the website directory.
7. Start the Docker containers and verify that memories and photographs load.

Important: Database restoration should be performed carefully against the correct database. Do not overwrite a working database without first making a fresh backup.

## 8. Limitations and Future Improvements

- Backups currently cover the Hawaii website's database and photographs, not the entire Raspberry Pi.
- The OptiPlex must be running for scheduled transfers to occur.
- The OptiPlex currently keeps older copies indefinitely, so disk usage should be monitored.
- Backup failure notifications have not been configured.
- The backup archives are not encrypted.
- A complete disaster recovery test on a replacement Pi has not been performed.
- Backup scripts and service configurations should also be preserved in version control.
