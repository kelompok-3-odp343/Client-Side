# Gunakan image Node.js untuk build aplikasi
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Gunakan Nginx untuk menyajikan hasil build
FROM nginx:stable-alpine

# Salin hasil build React ke folder default Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Buat simple nginx config untuk SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]