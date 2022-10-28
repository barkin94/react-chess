FROM node:16 as builder

ARG SOCKET_URL

ENV REACT_APP_SOCKET_URL=$SOCKET_URL
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx
COPY --from=builder ./usr/src/app/build /usr/share/nginx/html
EXPOSE 8080