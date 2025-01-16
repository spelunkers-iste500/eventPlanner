# Event Planning Travel Management System

So right now this is only just a boilerplate project from [here](https://api-platform.com/docs/symfony/) since I thought this would make everyones lives easier.

## Setting up the development environment

Buckle up, this is going to be a long one. We're going to be using VSCode's remote development features. This means that you're going to have to install the `Remote Development` extension collection, among other ones. 
1. Install the `Remote Development` extension collection, as well as the php and next.js ones 
2. Open your ~/.ssh/config file and add the following, replacing things where necessary:
```
Host devbox
	HostName <devbox>.spelunkers.rit.edu
	User dev
```
Optional: specify private key for authentication:
```
Host devbox
	HostName <devbox>.spelunkers.rit.edu
	User dev
	IdentityFile ~/.ssh/id_rsa
```
3. Add the devbox public ssh key to your github account.
    1. Click on your profile, then settings
    2. Click on `SSH and GPG keys`
    3. ...
    4. Profit
4. Clone this repository.
5. Run `docker compose build --no-cache`
6. Run `docker compose up -d` to start the containers.
7. Provision the JWT public and private keys to allow authentication to work:
```
docker compose exec php sh -c '
    set -e
    apt-get install openssl
    php bin/console lexik:jwt:generate-keypair
    setfacl -R -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
    setfacl -dR -m u:www-data:rX -m u:"$(whoami)":rwX config/jwt
'
```
6. (Optional) If you are on the VPN, and need to connect to the instance you'll need to forward a port through VSCode. This can be found at the bottom of the window, under ports. You're going to want to forward port 443, and then click on the link that shows up.

Then, you can access the front-end through the vpn by going to the link to your dev box in your browser: `http://devbox/`. This should show 3 different tools for the API that one can use.

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

### Development Procedure



## The rest of the documentation

The rest of our documentation can be found under docs.
