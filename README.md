# Event Planning Travel Management System

This is an application designed to help organizations manage, plan, and audit travel expenditure. It is also supposed to give users a unified experience to book flights through, while attending events hosted by the organizations using this SaaS. 

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

1. Clone this repository.
2. Change into `api/` and run `composer install` to populate the packages necessary.
3. Run `docker compose build --no-cache`
4. Run `docker compose up -d` to start the containers.
5. Run `docker compose exec php bin/console doctrine:schema:create` to create the database schema and you should be on your way.
6. Forward the application port (443) to your local device. In VSCode this can be done at the bottom, under ports. If it doesn't forward automatically, enter 443 and that should be it.

Then, you can access the front-end through the vpn by going to the link to your dev box in your browser: `https://localhost/`.

## DevBoxes

Username: `dev`
Password: `SuperS3cretPassword!`

|Dev|Box|
|---|---|
|Casey|devbox01|
|Gavin|devbox02|
|George|devbox03|
|Noelle|devbox04|
|Logue|devbox05|
|Eddie|devbox06|
|Stef|devbox07|

## Database stuff

Currently the database has some crazy insecure defaults. To be changed later, and integrated with git secrets and variables. Doctrine is the ORM solution that we're going with, since it's in basically every tutorial online.

### For Schema Changes

If the database gives you a relationship error, at this point it means that the database schema is not up to date with the mapping files. The one liner below should fix this, and re-populate with the test data.

```bash
rm -rf api/migrations/*.php; docker compose exec php bin/console doctrine:database:drop --force --no-interaction; docker compose exec php bin/console doctrine:database:create; docker compose exec php bin/console doctrine:schema:create; docker compose exec php bin/console doctrine:fixtures:load --no-interaction
```

### Updating the database schema

When making changes to the structure or content of an entity file, you may have to migrate the database to the newest version of your schema. To update the database schema, you have to run these commands:

```bash
docker compose exec php bin/console doctrine:migrations:diff; docker compose exec php bin/console doctrine:migrations:migrate --no-interaction
```

