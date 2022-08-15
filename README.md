# Waiting Time Analysis Client

![build_badge](https://github.com/AutomatedProcessImprovement/waiting-time-frontend/actions/workflows/main.yml/badge.svg)

Frontend client for Waiting Time Analysis tool.

[//]: # (Will try to make this work)
[//]: # (https://dev.to/salehmubashar/search-bar-in-react-js-545l#:~:text=Creating%20the%20Search%20Bar&text=In%20your%20app.,"%20import%20".%2FApp.)

## Expected functionalities:

- Upload of event log (CSV format)
- Mapping of selected event log (required parameters)
- Dashboard overview of results
  - Overview: ```Generic information about event log```
  - Transitions ```Information about transitions between activities```
  - CTE Impact ```Information about Cycle time efficiency impacts```
- Sorting and filtering for tables
- Download of report in CSV and JSON format
## Missing functionalities:
- Event log mapping | WIP => Frontend OK. Backend server needs to accept mapping object in request for processing

#### Flair:

- Tooltips for most items

## Presentable progress:

### Home - Upload:
![](./screenshots/Home-Upload.PNG)
### Home - Mapping:
![](./screenshots/Home-Upload-Mapping.PNG)
### Home - Uploading:
![](./screenshots/Home-Upload-Uploading.PNG)
### Dashboard - Overview
![](./screenshots/Dashboard-Overview.PNG)
### Dashboard - Transitions
![](./screenshots/Dashboard-Transitions.PNG)
### Dashboard - Transitions Table details
![](./screenshots/Dashboard-Transitions-Table-Details.PNG)
### Dashboard - CTE Impact
![](./screenshots/Dashboard-CTEIMPACT.PNG)
### Dashboard - CTE Impact Table details
![](./screenshots/Dashboard-CTEIMPACT-Table-Details.PNG)
### Dashboard - Download Report
![](./screenshots/Dashboard-DownloadReport.PNG)