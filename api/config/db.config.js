/**
 * SOURCES: 
 *  - https://www.bezkoder.com/node-js-rest-api-express-mysql/
 *  - https://www.bezkoder.com/docker-compose-react-nodejs-mysql/
 */

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "restaurant_user",
  PASSWORD: process.env.DB_PASSWORD || "123456",
  DB: process.env.DB_NAME || "restaurant",
};