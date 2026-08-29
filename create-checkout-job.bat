@echo off
cd /d D:\Automation\playwright_spec
curl.exe -X POST "http://localhost:8080/job/Playwright_automation_exercise/createItem?name=Checkout-Spec-Tests" -H "Content-Type: application/xml" --user vivek:vivek -d @checkout-job-config.xml
echo Job creation completed
pause
