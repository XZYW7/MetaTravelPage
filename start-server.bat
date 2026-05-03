@echo off
echo ========================================
echo   MetaTravelPage 本地服务器
echo ========================================
echo.
echo 请在浏览器中访问 http://localhost:8000
echo 按 Ctrl+C 停止服务器
echo.
python -m http.server 8000
pause
