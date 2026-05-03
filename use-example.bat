@echo off
REM Usage Example Script
REM This script copies the Thailand travel example to the main config

echo Copying Thailand travel example to config...
copy /Y "examples\thailand-travel\journey.json" "config\journey.json"
xcopy /E /I /Y "examples\thailand-travel\assets\audio" "assets\audio"
xcopy /E /I /Y "examples\thailand-travel\assets\images" "assets\images"

echo Done! Open index.html to view the Thailand travel guide.
pause
