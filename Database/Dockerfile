FROM mariadb:10.6
ENV MYSQL_ROOT_PASSWORD=1
ENV MYSQL_DATABASE=movie_streaming_app
EXPOSE 3306
COPY Database.sql /docker-entrypoint-initdb.d/
