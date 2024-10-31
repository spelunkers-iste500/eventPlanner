# Event Planning Travel Management System

So right now this is only just a boilerplate from [here](https://api-platform.com/docs/symfony/) since I thought this would make everyones lives easier.

## Setting up the development environment

Buckle up, this is going to be a long one. Originally this was developed on Arch Linux, so I'm going to assume that's what you're on.

1. Make sure that docker is installed: `sudo pacman -Syu --no-confirm && sudo pacman -S docker --no-confirm`
   1. To make your life easier when you're running docker commands, run ``sudo usermod -aG docker `whoami` `` then logout or restart your dev container.
2. Clone this repository.
3. Run `docker compose build --no-cache`
4. Edit the `.env` file and change the lines to be the hostname of your dev box, otherwise it won't work (at all).
5. After that, run `docker compose up -d` 
