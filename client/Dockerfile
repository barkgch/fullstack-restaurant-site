# Stage 1 - build React application
FROM node:14 as build-stage

WORKDIR /client
COPY package.json .
RUN npm install
COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm run build

# Stage 2 - serve React application with Nginx
FROM nginx:1.17.0-alpine

COPY --from=build-stage /client/build /usr/share/nginx/html
# expose port (should be 80) to Docker host
EXPOSE $REACT_DOCKER_PORT

CMD nginx -g 'daemon off;'
# 'daemon off;' tells nginx to stay in foreground