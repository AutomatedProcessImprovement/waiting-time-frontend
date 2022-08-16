# Waiting Time Analysis Client

![build_badge](https://github.com/AutomatedProcessImprovement/waiting-time-frontend/actions/workflows/main.yml/badge.svg)

Frontend client for Waiting Time Analysis tool.

[//]: # (Will try to make this work)
[//]: # (https://dev.to/salehmubashar/search-bar-in-react-js-545l#:~:text=Creating%20the%20Search%20Bar&text=In%20your%20app.,"%20import%20".%2FApp.)

## Start the client locally (via npm)

> Please, note that you need to have `Node.js` and `npm` installed on your computer in order to follow these steps. The instructions on how to do that could be found here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#overview
1) Install all dependencies
    ```
    npm install
    ```
   If you run into issues with the previous command run the following command:
   ```
   npm install --save --legacy-peer-deps
   ```
2) Start the client
    ```
    npm start
    ```


## Included functionalities:

- Upload of event log (CSV format)
- Mapping of selected event log (required parameters)
- Dashboard overview of results
  - Overview: ```Generic information about event log```
  - Transitions ```Information about transitions between activities```
  - CTE Impact ```Information about Cycle time efficiency impacts```
- Sorting and filtering for tables
- Download of report in CSV and JSON format
- Custom tooltips for most dashboard charts and info boxes
- Heatmap to easily spot improvement opportunities

## Upcoming functionalities:
- Event log mapping | WIP => Frontend OK. Backend server needs to accept mapping object in request for processing

## Visual showcase:

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
### Dashboard - CTE Impact Heatmap
![](./screenshots/Dashboard-CTEIMPACT-Table-Heatmap.PNG)
### Dashboard - Download Report
![](./screenshots/Dashboard-DownloadReport.PNG)