@echo off
echo Starting development server...
:loop
python -m http.server 8000
echo Server stopped, restarting in 2 seconds...
timeout /t 2
goto loop 