# fullstack-restaurant-site

## backend

**based on**: https://www.bezkoder.com/node-js-rest-api-express-mysql/

**using**: Node.js Express, MySQL

### all modules
 - express
 - mysql
 - cors

## frontend

**based on**:
 - https://www.bezkoder.com/react-node-express-mysql/
 - https://www.bezkoder.com/react-crud-web-api/
 - (that video tutorial)

**using**: React (through create-react-app), axios, bootstrap

**NOTE**: `npm audit` will show some vulnerabilities in the frontend.
These are false positives. `npm audit --production` should be used instead for
more accurate report.
See [here](https://github.com/facebook/create-react-app/issues/11174#issue-935928547) for more.

### all modules
list of all additional modules that have been installed after
`npx create-react-app` or `npm init react-app` have been run.
 - axios
 - bootstrap
 - react-router-dom
 - sass (to allow scss file use)