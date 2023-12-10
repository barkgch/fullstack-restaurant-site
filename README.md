# fullstack-restaurant-site

## backend

**based on**: https://www.bezkoder.com/node-js-rest-api-express-mysql/

**using**: Node.js Express, MySQL

### all modules
 - express
 - mysql2
 - cors
 - bcryptjs (for password encryption)

## frontend

**based on**:
 - https://www.bezkoder.com/react-node-express-mysql/
 - https://www.bezkoder.com/react-crud-web-api/
 - [Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial](https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi)

**using**: React (through create-react-app), axios, bootstrap,
Nginx (for serving React build within Docker container)

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

## running locally

run `npm install` in `./api/` and in `./client`. this should only need to be done
once, just to download all the modules specified in the `package.json` file at
each directory.

MySQL must be set up as outlined below.

Once both steps above are completed, run the backend and frontend servers with
`npm start` in `./api/` and in `./client/`.

### MySQL setup

(based off of the
[report 3 doc](https://docs.google.com/document/d/1NEaz9-x3zibC6JoXMWk7hkskMsiuFcdolJ_BZYOd248/edit?usp=sharing).
as we all work on our parts of the site, we can add new tables to our MySQL and
update this section)

```sql
CREATE DATABASE restaurant;

CREATE USER 'restaurant_user'@'localhost' IDENTIFIED BY '123456';

GRANT SELECT, INSERT, DELETE, UPDATE
ON restaurant.*
TO 'restaurant_user'@'localhost';

USE restaurant;

CREATE TABLE CUSTOMER (
  PhoneNum VARCHAR(14) NOT NULL,
  FName VARCHAR(35) NOT NULL,
  LName VARCHAR(35) NOT NULL,
  PRIMARY KEY (PhoneNum)
);

CREATE TABLE ACCOUNT (
  AccountID INT NOT NULL AUTO_INCREMENT,
  Email VARCHAR(254) NOT NULL,
  Password VARCHAR(45) NOT NULL,
  PRIMARY KEY (AccountID)
);


CREATE TABLE CUSTOMER_ACCOUNT (
  AccountID INT NOT NULL,
  Customer VARCHAR(14) NOT NULL,
  NumPastOrders INT DEFAULT 0,
  PRIMARY KEY (AccountID),
  FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID)
    ON DELETE CASCADE,
  FOREIGN KEY (Customer) REFERENCES CUSTOMER(PhoneNum)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE EMPLOYEE_ACCOUNT (
  AccountID INT NOT NULL,
  FName VARCHAR(35) NOT NULL,
  LName VARCHAR(35) NOT NULL,
  PermissionLevel INT DEFAULT 0,
  PRIMARY KEY (AccountID),
  FOREIGN KEY (AccountID) REFERENCES ACCOUNT(AccountID)
    ON DELETE CASCADE
);
```