# 01 — Raspberry Pi and Linux

## What Linux does

The Raspberry Pi 5 is the computer hosting the site. Linux manages processes, storage, permissions, network interfaces, and services. Docker runs **on top of** Linux; it does not replace the operating system.

## Paths we used

- `~/docker/hawaii-site`: live website and Compose project.
- `~/home-lab/projects/hawaii-site`: Git-tracked project copy.
- `~` means the current user's home directory; for `joe`, that is `/home/joe`.

## Commands, explained

```bash
pwd                   # print the current directory
ls -la                # list files, including hidden files, with details
cd ~/docker/hawaii-site # change into the live project directory
python3 -m py_compile backend/app.py # check Python syntax without running the API
```

`python3 -m py_compile` invokes Python's `py_compile` module. It checks syntax, not database connectivity, route behavior, or security. It may create a `__pycache__` directory.

## SSH and remote editing

SSH provides an encrypted remote shell. VS Code Remote-SSH lets us edit files on the Pi from another computer. Changes to bind-mounted static files can appear immediately after refresh; Python files copied into a Docker image require rebuilding that image.

## Check yourself

1. What is the difference between the workstation and the Raspberry Pi?
2. Why can `pwd` help prevent editing the wrong copy of a file?
3. Why does passing a syntax check not prove the API works?
