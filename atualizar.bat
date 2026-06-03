@echo off
echo.
echo ========================================
echo   Atualizando checkout no Vercel...
echo ========================================
echo.

cd /d "%~dp0"

git add .
git commit -m "atualizacao"
git push

echo.
echo ========================================
echo   Pronto! Site atualizado no Vercel.
echo ========================================
echo.
pause
