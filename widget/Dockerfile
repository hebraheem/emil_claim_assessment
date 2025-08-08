FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 5174
CMD ["yarn", "start"]
