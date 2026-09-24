# ============================================================
# InterviewBuddy Backend — production Docker image
# Multi-stage build:
#   stage 1: compile & package the Spring Boot fat-jar (Maven + JDK 21)
#   stage 2: minimal JRE 21 runtime image
# ============================================================

# ---- Stage 1: build ----
# Image tag is pinned for reproducibility. "go-offline" pre-warming is omitted:
# it fails on some CI builders for artifacts that are only needed at build time,
# and every container build is a fresh clone anyway, so the cache was useless.
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /build

# Keep the Maven JVM within Render free tier's 512MB RAM so the build does not
# get OOM-killed.
ENV MAVEN_OPTS="-Xmx384m -XX:MaxMetaspaceSize=256m"

COPY pom.xml .
COPY src ./src
RUN mvn -B -q -DskipTests package

# ---- Stage 2: runtime ----
FROM eclipse-temurin:21-jre-jammy
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

# Docker healthcheck against the actuator endpoint (Render uses its own
# healthCheckPath; this gives docker-compose / local `docker run` the same probe).
# PORT is only set by the host (Render sets it), otherwise default to 8080.
HEALTHCHECK --interval=30s --timeout=5s --start-period=120s --retries=3 \
  CMD curl -fsS "http://127.0.0.1:${PORT:-8080}/actuator/health" > /dev/null || exit 1
