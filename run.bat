@echo off
title VeriFace - Clean Run
color 0A

echo ==========================================
echo VeriFace Automated Runner
echo ==========================================
echo.

cd /d D:\VeriFace

echo [1/8] Killing old Node / Metro processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/8] Checking Android device/emulator...
adb devices

echo.
echo [3/8] Cleaning Android build...
cd android
call gradlew clean
cd ..

echo.
echo [4/8] Starting Metro server on port 8088...
start "VeriFace Metro 8088" cmd /k "cd /d D:\VeriFace && npx react-native start --reset-cache --port 8088"

echo.
echo [5/8] Waiting for Metro to initialize...
timeout /t 12 /nobreak >nul

echo.
echo [6/8] Building and installing Android app...
call npx react-native run-android --port 8088

echo.
echo [7/8] App build command finished.
echo.

echo [8/8] Done.
echo.
pause