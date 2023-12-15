FROM node:20-alpine

WORKDIR /usr/reward-system-server

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 8080

CMD ["yarn","run", "dev"]
