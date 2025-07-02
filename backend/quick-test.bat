@echo off
echo 🚀 Textura API Testing Suite
echo ================================

echo.
echo 📊 Testing Server Health...
curl -s -I http://localhost:5000/api/products | findstr "HTTP/1.1"

echo.
echo 🔐 Testing Auth Rate Limiting...
echo Request 1:
curl -s -X POST -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"test\"}" http://localhost:5000/api/auth/login | findstr "RateLimit"

echo Request 2:
curl -s -X POST -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"test\"}" -v http://localhost:5000/api/auth/login 2>&1 | findstr "RateLimit"

echo Request 3:
curl -s -X POST -H "Content-Type: application/json" -d "{\"username\":\"test\",\"password\":\"test\"}" -v http://localhost:5000/api/auth/login 2>&1 | findstr "RateLimit"

echo.
echo 📁 Testing Static File Cache...
curl -s -I http://localhost:5000/images/products/nike-dunk-low.jpg | findstr "Cache-Control"

echo.
echo 🗄️ Testing API Cache...
echo First request:
curl -s -v http://localhost:5000/api/products 2>&1 | findstr "x-cache-status"
echo Second request:
curl -s -v http://localhost:5000/api/products 2>&1 | findstr "x-cache-status"

echo.
echo ❌ Testing 404 Pages...
echo API 404:
curl -s http://localhost:5000/api/nonexistent | head -3

echo Web 404:
curl -s http://localhost:5000/nonexistent | head -5

echo.
echo 🎉 Testing Complete!
echo ================================
echo For full comprehensive tests, run: node test-all-endpoints.js
pause
