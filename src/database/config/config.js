const { config } = require('dotenv');
config({ path: '.env' });

const development = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST || 'host.docker.internal',
  port: process.env.DATABASE_PORT,
  dialect: "postgres",
};

// const development = {
//   username: 'postgres',
//   password: 'Vaghela@1999',
//   database: 'To-Do List',
//   host: 'host.docker.internal',
//   port: 5432,
//   dialect: "postgres",
// };

const production = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: "postgres",
};

module.exports = {
  development,
  production
};
