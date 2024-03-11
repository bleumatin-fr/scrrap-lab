# DEPLOYMENT

Deployment works with docker. The image is built then pushed on a registry, the server then fetches that image through docker-compose to run the app.

Per-commit images are stored on registry.bleumatin.fr and tagged commits push the image to ghcr.io

## Build

```bash
docker build --no-cache --tag [registry]/[image]:[tag] .
```

## Publish

```bash
docker push [registry]/[image]:[tag]
```

## First installation

For the first installation, you need to initialize a docker-compose file with all environment variables set.
An example is available in `.deployment/docker-compose.yml`.

By default, the app will be served on port 3000 but will work if mapped to any other port with docker.

### Environment variables

#### MONGO_URL

Connection string for mongodb.

Example: `mongodb://root:myP4ssw0rd@mongo:27017/admin`


##### JWT_SECRET

Secret used to sign authentication JWT token and OnlyOffice DocumentServer JWT tokens

ex: `XcG8Eqnt3j52BQsJe2DskNB9`

##### JWT_EXPIRY

Time in ms before the JWT auth token expires

ex : `60 * 60 * 1000` (= 1 hour)

##### REFRESH_TOKEN_SECRET

Secret used to sign authentication refresh token

ex : `daiGixHvEq9UUjou7WWZ86hg`

##### REFRESH_TOKEN_EXPIRY

Time in ms before the JWT auth token expires

ex : `60 * 60 * 1000 * 24` (= 24 hours)

##### COOKIE_SECRET

Secret used to sign authentication cookies

ex : `uqUB6o5X9jgCi6kyS2273DER`

##### RESET_PASSWORD_TOKEN_SECRET

Secret used to sign the refresh password token in reset password mails

ex : `wGeobRQpwMuWE7`

##### RESET_PASSWORD_TOKEN_EXPIRY

Time in ms before the link in the reset password mails becomes inactive

ex : `60 * 60 * 1000 * 24 * 30`

#### HOSTNAME

IP address of the interface where the app should listen, use 0.0.0.0 to listen on all interfaces.

Example: `0.0.0.0`

#### BASE_URL

Address where the app is hosted.

Example: `https://chuto.talm.fr/collector`

#### BASE_PATH

Subpath where the app is hosted, leave blank if it's hosted on root domain.

Example: `/collector`

#### MAIL_HOST

Host for the SMTP server.

Example: `587`

#### MAIL_PORT

PORT for the SMTP server.

Example: `talm.fr`

#### MAIL_AUTH_USERNAME

(Optional)

Username for SMTP authentication

Example: `no-reply@talm.org`

#### MAIL_AUTH_PASSWORD

(Optional)

Username for SMTP authentication

Example: `m41lb0x-p4ssw0rd`

#### MAIL_FROM

Mail address from where the app sends its mails.

Example: `no-reply@talm.fr`

#### NEXT_PUBLIC_CALCULATOR_URL

Address where the calculator is hosted

Example: `https://chuto.talm.fr/scrrap`


#### NEXT_PUBLIC_CALCULATOR_PROJECT_TYPE

Which model to use when importing metrics

Example: `NEXT_PUBLIC_CALCULATOR_PROJECT_TYPE=project`

## Backups

- MongoDB : holds all data. [Backup / restore guide](https://www.mongodb.com/docs/manual/tutorial/backup-and-restore-tools/)
- uploads docker Volume : holds all pictures for offcuts. [Volume driver documentation](https://docs.docker.com/storage/volumes/#share-data-between-machines)
