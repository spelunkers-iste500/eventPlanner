# The Frontend

Build on react and next.js, serving SSR and CSR content to improve performance and security.

## Changing Hands

To change hands, you will need to redefine the environment variables that are passed in through docker compose as well as in the `.env` and `.env.local` files. The database adapter can be changed, as long as updates are made to the backend (`php`) entity definitions so that the database is usable. In addition, the email provider can be changed to another built-into-authjs, or it can use `nodemailer` to define a custom email server. Documentation can be found on [authjs](https://authjs.org).
