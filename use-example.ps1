# Usage Example Script
# This script copies the Thailand travel example to the main config

Write-Host "Copying Thailand travel example to config..." -ForegroundColor Green

# Copy journey.json
Copy-Item -Path "examples\thailand-travel\journey.json" -Destination "config\journey.json" -Force

# Copy audio files
if (Test-Path "examples\thailand-travel\assets\audio") {
    Copy-Item -Path "examples\thailand-travel\assets\audio\*" -Destination "assets\audio\" -Force
}

# Copy image files
if (Test-Path "examples\thailand-travel\assets\images") {
    Copy-Item -Path "examples\thailand-travel\assets\images\*" -Destination "assets\images\" -Force
}

Write-Host "Done! Open index.html to view the Thailand travel guide." -ForegroundColor Green
