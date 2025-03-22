# Runbook

This is the oncall runbook used to assess the heath of our systems.

## KPIs

- API success rate - The API should always succeed and return 200 status codes
- API latency - The API should always return quickly. We aim for P99 latency under 10s.

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

First! Don't panic, we have this runbook to guide you.

1. Gather historical data from Render metrics to determine the scope of the issue and start time. Make sure to save relevant graphs.

2. If you notice an issue, try to reproduce it yourself. 
- Check that home page loads and the health check and search APIs respond quicky. 
- Expected results:
 -- /api/ping -> pong
 -- /api/search -> this result can be anything and should not be verified, just check the latency is <10 sec.

3. Check for recent deploys to Render and recent feature flag changes with LaunchDarkly. In general, an issue will start when new code is running. 

4. If it's clear that a flag flip or deploy caused the issue, notify the team and go ahead turning off the flag or rolling back the deploy. 

5. Make sure to verify the change.


## Important notes

- If you ever notice anything is wrong, don't hesitate to notify the rest of the team by saying something outloud before continuing your investigation.

- Save a log of what you checked, what results you found and what you determined from that. This log will be helpful for the retrospective and improving in the future. Ideally, this is a markdown file that includes all the relevant links and embeds important images (eg graphs).

## Render API

Sample curl to get latency time series data
```bash
curl --request GET \
     --url 'https://api.render.com/v1/metrics/http-latency?resolutionSeconds=30&path=<api_path>&resource=<service-id>&quantile=0.99' \
     --header "accept: application/json" \
     --header "authorization: Bearer $RENDER_API_KEY"
```

```bash
curl --request GET \
     --url 'https://api.render.com/v1/metrics/http-requests?resolutionSeconds=30&aggregateBy=statusCode&path=<api_path>&resource=<service-id>' \
     --header "accept: application/json" \
     --header "authorization: Bearer $RENDER_API_KEY"
```

To get recent deploys
```bash
curl --request GET \
     --url 'https://api.render.com/v1/services/<service-id>/deploys?limit=20' \
     --header 'accept: application/json' \
     --header "authorization: Bearer $RENDER_API_KEY"
```

To roll back a deploy

```bash
curl --request POST \
     --url https://api.render.com/v1/services/<service_id>/rollback \
     --header 'accept: application/json' \
     --header 'content-type: application/json' \
     --header "authorization: Bearer $RENDER_API_KEY \
     --data '
{
  "deployId": "<deploy_id>"
}
'
```

## LaunchDarkly API

Audit log of recent changes
```bash
curl https://app.launchdarkly.com/api/v2/auditlog \
     -H "Authorization: $LAUNCHDARKLY_API_KEY"
```

Turn off a feature flag
```bash
curl -X PATCH \
  https://app.launchdarkly.com/api/v2/flags/default/<flag-name> \
  -H "Authorization: $LAUNCHDARKLY_API_KEY" \
  -H "Content-Type: application/json; domain-model=launchdarkly.semanticpatch" \
  -d '{
        "environmentKey": "test",
        "instructions": [ { "kind": "turnFlagOff" } ]
      }'
```