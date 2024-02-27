FROM node:18.16.0
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 8010
CMD ["yarn", "dev"]
