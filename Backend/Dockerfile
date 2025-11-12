#build
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw
RUN ./mvnw -B -DskipTests package

# runtime
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
COPY src/main/resources/certs/ca.pem /tmp/ca.pem

RUN if [ -f /tmp/ca.pem ]; then \
      if [ -n "$JAVA_HOME" ] && [ -f "$JAVA_HOME/lib/security/cacerts" ]; then \
        keytool -importcert -noprompt -trustcacerts -alias aiven-ca -file /tmp/ca.pem -keystore "$JAVA_HOME/lib/security/cacerts" -storepass changeit ; \
      else \
        keytool -importcert -noprompt -trustcacerts -alias aiven-ca -file /tmp/ca.pem -keystore /etc/ssl/certs/java/cacerts -storepass changeit || true ; \
      fi \
    fi

ENV JAVA_OPTS=""

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]