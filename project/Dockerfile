FROM node:18.16.0
# RUN apt-get update && \
#     apt-get install -y mongodb && \
#     apt-get clean
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
# EXPOSE 27017
EXPOSE 8010
CMD ["yarn", "dev"]
