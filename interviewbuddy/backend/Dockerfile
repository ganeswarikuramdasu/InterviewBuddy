# ============================================================
# InterviewBuddy Backend — production Docker image
# Multi-stage build:
#   stage 1: compile & package the Spring Boot fat-jar (Maven + JDK 21)
#   stage 2: minimal JRE 21 runtime image
# ============================================================

# ---- Stage 1: build ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Copy the POM first so dependency resolution is cached independently
# of source changes (faster incremental rebuilds).
COPY pom.xml .
RUN mvn -B -q dependency:go-offline

# Copy sources and build the jar (tests run inside CI instead of the image).
COPY src ./src
RUN mvn -B -q -DskipTests package

# ---- Stage 2: runtime ----
FROM eclipse-temurin:21-jre
WORKDIR /app

# curl is used by the Docker healthcheck (actuator endpoint).
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app && useradd --system --gid app --no-create-home app

# Run as a non-root user for security.
USER app

COPY --from=build /build/target/interviewbuddy-backend-1.0.0.jar /app/app.jar

EXPOSE 8080

# Container-friendly JVM defaults for predictable behaviour with cgroup limits.
ENV JAVA_OPTS=""
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
