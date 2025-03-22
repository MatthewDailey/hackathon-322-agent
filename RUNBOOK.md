# Runbook

This is the oncall runbook used to assess the heath of our systems.

## KPIs

- API success rate - The API should always succeed and return 200 status codes
- API latency - The API should always return quickly. We aim for less 1s latency 99% of the time.

## Important pages and endpoints

Home page: https://hackathon-322-web.onrender.com/
Health check API: https://hackathon-322-web.onrender.com/api/ping
Search API: https://hackathon-322-web.onrender.com/api/search?query=<samplequery>

## Platform links

Feature flags on LaunchDarkly: https://app.launchdarkly.com/projects/default/flags

Render 
- Web service: https://dashboard.render.com/web/srv-cvfft3nnoe9s73bh37gg
- service id: srv-cvfft3nnoe9s73bh37gg

## How to check the system health

First! Don't panic, we have this runbook to guide you. If you notice something is wrong, the first thing to do is check all of our core services to understand the scope of the issue. 

1. Check that home page loads and the health check and search APIs respond quicky.

2. If there is any issue, gather historical data from Render metrics to determine the scope of the issue and start time.

3. Check for recent deploys to Render and recent feature flag changes with LaunchDarkly. In general, an issue will start when new code is running. 

4. If it's clear that a flag flip or deploy caused the issue, notify the team and go ahead turning off the flag or rolling back the deploy.


## Important notes

- If you ever notice anything is wrong, don't hesitate to notify the rest of the team before continuing your investigation.

- Save a log of what you checked, what results you found and what you determined from that. This log will be helpful for the retrospective and improving in the future.