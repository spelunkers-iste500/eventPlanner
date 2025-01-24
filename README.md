# Event Planning Travel Management System

So right now this is only just a boilerplate project from [here](https://api-platform.com/docs/symfony/) since I thought this would make everyones lives easier.

[![CI](https://github.com/spelunkers-iste500/eventPlanner/actions/workflows/ci.yml/badge.svg)](https://github.com/spelunkers-iste500/eventPlanner/actions/workflows/ci.yml)

## Setting up the development environment

Buckle up, this is going to be a long one. We're going to be using VSCode's remote development features. This means that you're going to have to install the `Remote Development` extension collection, among other ones.

1. Install the `Remote Development` extension collection, as well as the php and next.js ones
2. Open your ~/.ssh/config file and add the following, replacing things where necessary:

```bash
Host devbox
    HostName $devBox.spelunkers.rit.edu
    User dev
```

Optional: specify private key for authentication:

```bash
Host devbox
    HostName $devBox.spelunkers.rit.edu
    User dev
    IdentityFile ~/.ssh/id_rsa
```

1. Add the devbox public ssh key to your github account.
    1. Click on your profile, then settings
    2. Click on `SSH and GPG keys`
    3. ...
    4. Profit
2. Clone this repository.
3. Run `docker compose build --no-cache`
4. Run `docker compose up -d` to start the containers.
5. Forward the application port (443) to your local device. In VSCode this can be done at the bottom, under ports. If it doesn't forward automatically, enter 443 and that should be it.
6. (Optional) If you are on the VPN, and need to connect to the instance you'll need to forward a port through VSCode. This can be found at the bottom of the window, under ports. You're going to want to forward port 443, and then click on the link that shows up.

Then, you can access the front-end through the vpn by going to the link to your dev box in your browser: `https://localhost/`.

## IMPORTANT: Updating Dependancies

Run `./update-deps.sh` so things don't break.

## Database stuff

Currently the database has some crazy insecure defaults. To be changed later, and integrated with git secrets and variables. Doctrine is the ORM solution that we're going with, since it's in basically every tutorial online.

### Updating the database schema

When making changes to the structure or content of an entity file, you may have to migrate the database to the newest version of your schema. To update the database schema, you have to run these commands:

```bash
docker compose exec php bin/console doctrine:migrations:diff; docker compose exec php bin/console doctrine:migrations:migrate --no-interaction
```

### Recreating the database

Sometimes recreating the database is the move. To do so, run the following:

```bash
rm -rf api/migrations/*.php; docker compose exec php bin/console doctrine:database:drop --force; docker compose exec php bin/console doctrine:database:create; docker compose exec php bin/console doctrine:schema:create
```

### Protip: add this to your .bashrc

```bash
alias migratedb="docker compose exec php bin/console doctrine:migrations:diff; docker compose exec php bin/console doctrine:migrations:migrate --no-interaction"
alias resetdb="rm -rf api/migrations/*.php; docker compose exec php bin/console doctrine:database:drop --force; docker compose exec php bin/console doctrine:database:create; docker compose exec php bin/console doctrine:schema:create"
```

## Development boxes

Our development boxes are managed using ansible. Your user is named `dev` and has the password `SuperS3cretPassword!`. Change this at your leisure, should only be needed to install your ssh key.

## DevBox Assignments

|Dev|Box|
|---|---|
|Casey|devbox01|
|Gavin|devbox02|
|George|devbox03|
|Noelle|devbox04|
|Logue|devbox05|
|Eddie|devbox06|
|Stef|devbox07|
