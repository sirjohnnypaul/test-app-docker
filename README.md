# test-app-docker

## 1. Project structure

The main folder contains a backend Nest.js app and frontend React App. The main `docker-compose.yml` file is responsible for setting up all environments.

Docker installations:

- zookeeper
- kafka
- nest
- react
- mariadb (not used for the purpose of the task since it was not really necessary at the moment. It would be a good idea if we would like to keep track for each email sent and have a record in database. Since there was an information in task description to add db if required - even if it was not required I decided to add it there so you could check also that I can do that without any problem. However, since I am using Mac OS with Apple Silicon, I had to go for MariaDB option.)

## 2. .ENV file setup

### 2.1 BACKEND:

Before running the app, please navigate to backend folder and find directory environments. Inside there is a `demo.env` file -> Please duplicate it or rename it and set its name to `.env`. Inside there are few positions to update.

```bash
APP_PORT=3000
NODE_ENV=local1
DATABASE_USER=fena
DATABASE_PASSWORD=1234
DATABASE_NAME=fena-task
DATABASE_PORT=3306
DATABASE_HOST=localhost
IMPORT_MOCKS=false

MAILER_TEST_RECIPIENT=example@example.com # test emails will be sent to this email so you could test it
MAILER_OFFICE=no-reply@example.com # this can be a random name like this one
MAILER_HOST= # example smtp.gmail.com
MAILER_PORT= # recommended 465
MAILER_AUTH_USER= # Google email address
MAILER_AUTH_PASS= # Google code for allowed applications - to be generated in account panel
```

### 2.2 FRONTEND:

In the root directory create .env file and update the fields below:

```bash
REACT_APP_NODE_ENV=development
REACT_APP_API_URL_DEV=http://localhost:8000/
```

## 3. Installation and running:

To run the installation and start process, run the commands below:

```bash
docker compose build
docker compose up
```

After all containers start properly, you can then access the frontend app at http://localhost:3000.

The backend is running on port 8000.

## 4. Additional information:

All additional information that are required are in comments in the specific code sections.