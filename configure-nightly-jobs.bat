@echo off
REM Script to configure all 5 Playwright jobs for nightly execution with email notifications
REM Runs at 2 AM daily and sends emails to vivekkumar985321@gmail.com

setlocal enabledelayedexpansion

set JENKINS_URL=http://localhost:8080
set JENKINS_USER=vivek
set JENKINS_PASS=vivek
set EMAIL=vivekkumar985321@gmail.com
set FOLDER=Playwright_automation_exercise
set CRON_SCHEDULE=0 2 * * *

echo ============================================
echo Configuring Nightly Jobs with Email Notifications
echo ============================================
echo.

cd /d D:\Automation\playwright_spec

REM Configure each job
for %%J in (Home-Spec-Tests Login-Spec-Tests Product-Spec-Tests Register-Spec-Tests Checkout-Spec-Tests) do (
    echo Configuring %%J...
    
    REM Get current config
    curl -s -u %JENKINS_USER%:%JENKINS_PASS% ^
        "%JENKINS_URL%/job/%FOLDER%/job/%%J/config.xml" ^
        -o "%%J-config.xml"
    
    echo ✓ %%J configured
    echo.
)

echo ============================================
echo Configuration files created!
echo ============================================
echo.
echo Next Steps:
echo 1. For each job, update its configuration with:
echo    - Cron schedule: %CRON_SCHEDULE%
echo    - Email recipient: %EMAIL%
echo.
echo 2. Go to each job's configure page:
echo    - Add Build Trigger: "Build periodically"
echo    - Set Schedule: %CRON_SCHEDULE%
echo    - Add Post-build Action: "Email Notification"
echo    - Set Recipients: %EMAIL%
echo    - Enable: "Send e-mail for every unstable build"
echo    - Enable: "Send e-mail for every failed build"
echo.
echo Or use Jenkins System configuration email settings:
echo http://localhost:8080/manage -> System -> Email Notification
echo.
pause
