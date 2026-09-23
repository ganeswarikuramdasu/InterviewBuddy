@echo off
cd /d C:\Users\ganes\Downloads\InterviewBuddy\interviewbuddy\backend
set DB_PASSWORD=Ganeswari@2006
set CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
set APP_FRONTEND_URL=http://localhost:5173
mvn spring-boot:run > run-backend.log 2>&1