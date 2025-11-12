# build
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src
RUN ./mvnw -B -DskipTests package

# runtime
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY src/main/resources/certs/ca.pem /tmp/ca.pem

RUN if [ -f /tmp/ca.pem ]; then \
      keytool -importcert -noprompt -alias aiven-ca -file /tmp/ca.pem -keystore /app/aiven-truststore.jks -storepass changeit ; \
    fi

ENV JAVA_OPTS="-Djavax.net.ssl.trustStore=/app/aiven-truststore.jks -Djavax.net.ssl.trustStorePassword=changeit"

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]