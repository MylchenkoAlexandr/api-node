FROM node:14

WORKDIR /var/www/api

ENV NODE_ENV=development      

COPY package*.json ./

RUN npm install  

EXPOSE 3000

COPY . .

