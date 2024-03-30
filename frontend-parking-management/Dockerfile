
FROM node:18 as build
WORKDIR /app
COPY package*.json  ./
RUN yarn install
COPY . .
EXPOSE 5173
CMD [ "yarn", "dev" ]

# COPY . .
# RUN npm i
# RUN npm run build
# CMD ["npm", "start"]

# FROM nginx:1.21.0-alpine AS production

# # Copy các tệp tĩnh từ quá trình build trước đó vào hình ảnh nginx
# # Copy cấu hình Nginx
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/build /usr/share/nginx/html
# EXPOSE 5173
# CMD ["nginx", "-g", "daemon off;"]