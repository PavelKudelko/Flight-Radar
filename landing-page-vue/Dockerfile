FROM node:20-alpine as builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# build ngix
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# instead of doing this at building stage, mount it at runtime in the compose.yaml
# COPY ./nginx/nginx.conf /etc/nginx/nginx.conf