# Start local HTTP server for travel-page
Write-Host "Starting local server..." -ForegroundColor Green
Write-Host "Open http://localhost:8000 in your browser" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
python -m http.server 8000
