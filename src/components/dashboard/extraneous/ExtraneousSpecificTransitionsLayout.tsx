import React, {useEffect, useState} from 'react';
import {dhmToString} from "../../../helpers/dhmToString";
import {secondsToDhm} from "../../../helpers/SecondsToDhm";
import {Box, Grid} from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import WaitingTimeframe from "../overview/WaitingTimeframe";

interface ExtraneousSpecificTransitionsLayoutProps {
    jobId: string;
    selectedActivityPair: any;
}

const useFetchData = (url: string) => {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(jsonData => setData(jsonData))
            .catch(error => console.error(`Error fetching data from ${url}: `, error));
    }, [url]);
    return data;
};

const ExtraneousSpecificTransitionsLayout: React.FC<ExtraneousSpecificTransitionsLayoutProps> = ({ jobId, selectedActivityPair }) => {
    const [sourceActivity, destinationActivity] = selectedActivityPair.split(' - ');
    const overviewData = useFetchData(`http://154.56.63.127:5000/wt_overview/${jobId}/extraneous/${sourceActivity}/${destinationActivity}`);

    if (!overviewData) {
        return <div>Loading...</div>;
    }

    if (overviewData && overviewData.distinct_cases === 0 && overviewData.wt_sum === 0) {
        return <strong>This transition has no waiting time due to extraneous reasons</strong>;
    }

    const caseFrequencyOptions = {
        chart: {
            height: 300,
        },
        title: {
            text: null
        },
        series: [{
            type: 'pie',
            data: [
                ['Affected Cases', overviewData.distinct_cases],
                ['Total Cases', overviewData.cases - overviewData.distinct_cases]
            ]
        }]
    };

    const waitingTimeOptions = {
        chart: {
            height: 300,
        },
        title: {
            text: null
        },
        tooltip: {
            pointFormatter: function(this: any) {
                return `${this.series.name}: <b>${dhmToString(secondsToDhm(this.y))}</b>`;
            }
        },
        series: [{
            type: 'pie',
            data: [
                ['Extraneous WT', overviewData.wt_sum],
                ['Total WT', overviewData.total_wt_sum]
            ]
        }]
    };

    const biggestSourceDestPair = `${overviewData.biggest_source_dest_resource_pair[0]} - ${overviewData.biggest_source_dest_resource_pair[1]}`;
    const valueText = dhmToString(secondsToDhm(overviewData.biggest_source_dest_resource_pair[2]));
    const highestSourceText = overviewData.biggest_resource[0];
    const highestSourceValue = dhmToString(secondsToDhm(overviewData.biggest_resource[1]));

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            mx: "5rem"
        }}>
            <Grid container
                  spacing={3}
                  flexGrow={1}
                  justifyContent="flex-start"
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"stretch"}
            >
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Affected Cases</div>
                        <div>{overviewData.distinct_cases} / {overviewData.cases}</div>
                        <div style={{ width: '100%', height: '300px' }}>
                            <HighchartsReact highcharts={Highcharts} options={caseFrequencyOptions} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>WT due to Extraneous Reasons</div>
                        <div>{overviewData.wt_sum === 0 ? "0" : dhmToString(secondsToDhm(overviewData.wt_sum))}</div>
                        <div style={{ width: '100%', height: '300px' }}>
                            <HighchartsReact highcharts={Highcharts} options={waitingTimeOptions} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '20px' }}>Highest Source</div>
                        <div style={{ textAlign: 'left' }}>Resource: {highestSourceText}</div>
                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>{highestSourceValue}</div>
                        <div style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>Handover: {biggestSourceDestPair}</div>
                        <div style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>{valueText}</div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <WaitingTimeframe
                        jobId={jobId}
                        sourceActivity={sourceActivity}
                        destinationActivity={destinationActivity}
                        wtType={"extraneous"}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

export default ExtraneousSpecificTransitionsLayout;