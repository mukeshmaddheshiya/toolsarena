@echo off
echo.
echo  ToolsArena Deploy Script
echo  ========================
echo.

:: Check for commit message argument
if "%~1"=="" (
    set /p MSG="Enter commit message: "
) else (
    set MSG=%~1
)

echo.
echo [1/3] Staging all changes...
git add .

echo [2/3] Committing: %MSG%
git commit -m "%MSG%"

echo [3/3] Pushing to GitHub...
git push

echo.
echo  Deploying to Vercel...
vercel --prod

echo.
echo  Done! Site is live at https://tool-app-xi.vercel.app
echo.
pause
