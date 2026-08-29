# Configure Nightly Jobs with Email Notifications

## Steps to Configure Each Job (Repeat for all 5 jobs):

### 1. Home-Spec-Tests
- Go to: http://localhost:8080/job/Playwright_automation_exercise/job/Home-Spec-Tests/configure
- Scroll to **Build Triggers** section
- Check: "Build periodically"
- Enter Schedule: `0 2 * * *` (runs daily at 2 AM)
- Scroll to **Post-build Actions**
- Click "Add post-build action" → "Email Notification"
- Recipients: `vivekkumar985321@gmail.com`
- Check: "Send e-mail for every unstable build"
- Check: "Send e-mail for every failed build"
- Check: "Send separate e-mails to individuals who broke the build"
- Click **Save**

### 2. Login-Spec-Tests
- Go to: http://localhost:8080/job/Playwright_automation_exercise/job/Login-Spec-Tests/configure
- Repeat same steps as above

### 3. Product-Spec-Tests
- Go to: http://localhost:8080/job/Playwright_automation_exercise/job/Product-Spec-Tests/configure
- Repeat same steps as above

### 4. Register-Spec-Tests
- Go to: http://localhost:8080/job/Playwright_automation_exercise/job/Register-Spec-Tests/configure
- Repeat same steps as above

### 5. Checkout-Spec-Tests
- Go to: http://localhost:8080/job/Playwright_automation_exercise/job/Checkout-Spec-Tests/configure
- Repeat same steps as above

---

## Cron Schedule Syntax
- `0 2 * * *` = Every day at 2:00 AM
- `0 2 * * 1-5` = Weekdays only at 2:00 AM
- `0 2 * * 0` = Every Sunday at 2:00 AM
- `0 0 * * *` = Every day at midnight
- `H 2 * * *` = At 2 AM (Jenkins spreads load with 'H')

---

## Email Notification Settings
Configure Jenkins System Email (one time setup):
1. Go to: http://localhost:8080/manage
2. Click: "System"
3. Find: "Email Notification" section
4. Set:
   - **SMTP server**: smtp.gmail.com
   - **Default user e-mail suffix**: @gmail.com
   - **SMTP Authentication**: Enabled
   - **User Name**: your-email@gmail.com
   - **Password**: your-app-password
   - **SMTP Port**: 587
   - **Use TLS**: Checked

---

## Verify Configuration
After setup, test each job by:
1. Click job name
2. Click "Build Now"
3. Check console output
4. Verify email received at vivekkumar985321@gmail.com

---

## Summary
✓ All 5 jobs scheduled for 2 AM daily (nightly)
✓ Email notifications for pass/fail to vivekkumar985321@gmail.com
✓ Full 26 test suite runs automatically each night
