
FROM node:18 as builderFE
WORKDIR /app1
# COPY package*.json  ./
# RUN yarn install
# COPY . .
# # EXPOSE 5173
# CMD [ "yarn", "dev" ]

COPY . .
# ENV VITE_DOMAIN = /api
RUN yarn install
RUN yarn build
CMD [ "yarn", "dev" ]

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builderFE /app1/build /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]