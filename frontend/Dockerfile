# build first

FROM nginx

RUN rm -rf /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build /usr/share/nginx/html

ENTRYPOINT ["nginx", "-g", "daemon off;"]