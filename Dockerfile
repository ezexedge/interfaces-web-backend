FROM node:14.17

WORKDIR /app

COPY package.json .
COPY package-lock.json . 

RUN npm install

COPY . .
