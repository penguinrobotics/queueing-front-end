@echo off
start "Frontend" cmd /k "cd %USERPROFILE%\repos\queueing-front-end && npm start"
start "Backend" cmd /k "cd %USERPROFILE%\repos\queueing-server && npm start" 