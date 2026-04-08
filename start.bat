@echo off
echo Pokretanje HP Mostar Interaktivni Kutak...
start http://localhost:8080
python -m http.server 8080
pause
