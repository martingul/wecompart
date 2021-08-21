FROM nginx

EXPOSE 80/tcp
EXPOSE 443/tcp

COPY ./nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]