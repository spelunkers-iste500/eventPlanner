# Event Planning Travel Management System

So right now this is only just a boilerplate project from [here](https://api-platform.com/docs/symfony/) since I thought this would make everyones lives easier.

## Setting up the development environment

Buckle up, this is going to be a long one. Originally this was developed on Arch Linux, so I'm going to assume that's what you're on.

1. Make sure that docker is installed: `sudo pacman -Syu --no-confirm && sudo pacman -S docker --no-confirm`
   1. To make your life easier when you're running docker commands, run ``sudo usermod -aG docker `whoami` `` then logout or restart your dev container.
2. Clone this repository.
3. Run `docker compose build --no-cache`
4. Edit the `.env` file and change it to look like the following, replacing the hostname where appropriate:
   ```bash
    SERVER_NAME="devbox1:80"
    HTTP_PORT=8080
    TRUSTED_HOSTS="devbox1|php"
   ```
5. Run `docker compose up -d` to start the containers.

Then, you can access the front-end through the vpn by going to the link to your dev box in your browser: `http://devbox1:8080/`. This should show 3 different tools for the API that one can use.

## Database stuff

Currently the database has some crazy insecure defaults. To be changed later, and integrated with git secrets and variables. Doctrine is the ORM solution that we're going with, since it's in basically every tutorial online.

### Updating the database schema (sometimes destructive, but necessary)

To update the database schema, you have to run these commands:
```
docker compose exec php bin/console doctrine:migrations:diff
docker compose exec php bin/console doctrine:migrations:migrate
```
Answer yes to the second command to proceed.

## Development boxes

Our development boxes are managed using ansible. Your user is named `dev` and has the password `SuperS3cretPassword!`. Change this at your leisure, should only be needed to install your ssh key.