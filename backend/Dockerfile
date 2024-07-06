FROM node:18.18.2
# RUN apt-get update && \
#     apt-get install -y mongodb && \
#     apt-get clean
WORKDIR /app2
COPY package*.json ./
RUN yarn install
COPY . .
# EXPOSE 27017
EXPOSE 8010
CMD ["yarn", "dev"]
