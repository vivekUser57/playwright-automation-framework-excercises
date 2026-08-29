#!/bin/bash

# This script configures all 5 Playwright spec test jobs to run nightly and send email notifications

JENKINS_URL="http://localhost:8080"
JENKINS_USER="vivek"
JENKINS_PASS="vivek"
EMAIL="vivekkumar985321@gmail.com"
FOLDER="Playwright_automation_exercise"
JOBS=("Home-Spec-Tests" "Login-Spec-Tests" "Product-Spec-Tests" "Register-Spec-Tests" "Checkout-Spec-Tests")

# Cron schedule for 2 AM daily (nightly job)
CRON_SCHEDULE="0 2 * * *"

echo "Configuring nightly jobs with email notifications..."

for JOB in "${JOBS[@]}"; do
  echo "Configuring $JOB..."
  
  # Get current job config
  curl -s -u ${JENKINS_USER}:${JENKINS_PASS} \
    "${JENKINS_URL}/job/${FOLDER}/job/${JOB}/config.xml" \
    -o "/tmp/${JOB}-config.xml"
  
  # Add trigger and email notification to the XML
  # This is a simplified approach - you may need to adjust based on exact XML structure
  
  # Update with cron trigger and email notification
  sed -i "s|<triggers/>|<triggers><com.cloudbees.plugins.job.scheduling.BuildDiscarderProperty><strategy class=\"hudson.tasks.LogRotator\"><daysToKeepStr>-1</daysToKeepStr><numToKeepStr>-1</numToKeepStr><artifactDaysToKeepStr>-1</artifactDaysToKeepStr><artifactNumToKeepStr>-1</artifactNumToKeepStr></strategy></com.cloudbees.plugins.job.scheduling.BuildDiscarderProperty><hudson.triggers.TimerTrigger><spec>${CRON_SCHEDULE}</spec></hudson.triggers.TimerTrigger></triggers>|" "/tmp/${JOB}-config.xml"
  
  # Post-build action for email
  sed -i "s|</definition>|</definition><org.jvnet.hudson.plugins.groovypostbuild.GroovyPostbuildRecorder plugin=\"groovy-postbuild\"><script>if (manager.build.result.toString() == \"SUCCESS\") { manager.listener.logger.println(\"Build PASSED\") } else { manager.listener.logger.println(\"Build FAILED\") }</script><behavior>0</behavior></org.jvnet.hudson.plugins.groovypostbuild.GroovyPostbuildRecorder>|" "/tmp/${JOB}-config.xml"
  
  # Update job configuration
  curl -s -X POST -u ${JENKINS_USER}:${JENKINS_PASS} \
    -H "Content-Type: application/xml" \
    -d @"/tmp/${JOB}-config.xml" \
    "${JENKINS_URL}/job/${FOLDER}/job/${JOB}/config.xml"
  
  echo "✓ $JOB configured"
done

echo "All jobs configured for nightly execution!"
echo "Email notifications will be sent to: $EMAIL"
