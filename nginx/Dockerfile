FROM nginx:latest

COPY ./config/default.conf.template /etc/nginx/templates/default.conf.template

COPY ./tls/local.kabir.dev.crt /etc/nginx/ssl/fullchain.pem
COPY ./tls/local.kabir.dev.key /etc/nginx/ssl/privkey.pem
