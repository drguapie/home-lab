# Power Outage Recovery Test

## Scenario

An unexpected power outage caused the Raspberry Pi to lose power and reboot.

## Verification

After power was restored, the following checks were performed:

- Successfully connected to the Raspberry Pi using SSH.
- Verified Docker was running.
- Confirmed Portainer was running.
- Confirmed Uptime Kuma was running and healthy.
- Confirmed Nginx Proxy Manager was running.
- Verified Docker volumes and networks were preserved.

## Results

The Docker restart policy (`restart: unless-stopped`) successfully restarted all configured services after the system reboot.

No application data was lost because persistent Docker volumes were used.

## Lessons Learned

- Automatic restart policies improve service resilience.
- Docker volumes preserve application data across reboots.
- Performing verification checks after an outage is an important part of system administration.
