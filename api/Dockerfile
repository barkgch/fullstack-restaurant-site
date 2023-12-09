# syntax=docker/dockerfile:1

# specify node version
FROM node:14

WORKDIR /api

# copy package.json and then everything in project directory into container
COPY package.json .

# run executes command-line commands inside container
# npm install installs the package.json dependencies
RUN npm install

COPY . .

# run script npm start after container image is built
CMD npm start