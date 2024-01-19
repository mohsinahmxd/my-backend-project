# Northcoders News API

Link to live version: https://my-web-service-dwf8.onrender.com

In this project, I have built an API for the purpose of accessing application data programmatically. This backend service is able to provide information to front-end architectures.

The database is using PSQL, and is being interacted with using node-postgres.

Follow these steps to set up and run the project locally:

1. Clone the Repository: 
git clone git@github.com:your-username/my-backend-project.git

2. Install Dependencies: 
cd my-backend-project
npm install

3. Create .env Files:
In order to successfully connect the two databases locally, please create a .env.test file and a .env.development file. Into each, add PGDATABASE=, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.

4. Seed Local Database:
npm run seed

5. Run Tests:
npm test


