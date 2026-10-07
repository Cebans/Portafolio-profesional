@echo off
cd /d "%~dp0"
node scripts\update-photography.cjs
if errorlevel 1 echo No se pudo actualizar el album. Comprueba que Node.js este instalado.
pause
