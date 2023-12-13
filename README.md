# fullstack-restaurant-site

## backend

**based on**: https://www.bezkoder.com/node-js-rest-api-express-mysql/

**using**: Node.js Express, MySQL

### all modules
 - express
 - mysql2
 - cors
 - bcryptjs (for password encryption)
 - jsonwebtoken (for user authentication)
 - cookieparser (to allow use of cookies)

## frontend

**based on**:
 - https://www.bezkoder.com/react-node-express-mysql/
 - https://www.bezkoder.com/react-crud-web-api/
 - [Lama Dev's React Node.js MySQL Full Stack Blog App Tutorial](https://youtu.be/0aPLk2e2Z3g?si=2YauU5U6pDdNQLMi)
 - [freeCodeCamp's How to Validate Forms in React – A Step-By-Step Tutorial for Beginners](https://www.freecodecamp.org/news/how-to-validate-forms-in-react/)

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
 - react-hook-form (for easier input validation on forms)
 - sass (to allow scss file use)

## running locally

run `npm install` in `./api/` and in `./client`. this should only need to be done
when first cloning into this repository or when changes are made to which packages
are being used, just to download all the modules specified in the `package.json` file at
each directory.

MySQL must be set up as outlined in the queries below.

Once both steps above are completed, run the backend and frontend servers with
`npm start` in `./api/` and in `./client/` respectively.

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
  Password VARCHAR(60) NOT NULL,
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

CREATE TABLE ITEM (
  ItemID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(255) NOT NULL,
  Description TEXT,
  Picture VARCHAR(255),
  Price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (ItemID)
);
```

## misc. Notes

### restaurant employee privilege levels

0 - only has access to waitlist/reservations

1 - same as 0 and also has access to special reservation info

2 - same as 1 and also has access to customer account info

3 - same as 2 and also can modify menu items

4 - same as 3 and also can modify location info

5 - same as 4 and also can create and modify employee accounts