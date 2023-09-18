import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { secondsToDhm } from '../../../helpers/SecondsToDhm';
import { dhmToString } from '../../../helpers/dhmToString';

interface SpecificTransitionLayoutProps {
    jobId: string;
    selectedActivityPair: string;
}

const SpecificTransitionLayout: React.FC<SpecificTransitionLayoutProps> = ({ jobId, selectedActivityPair }) => {
    const [data, setData] = useState<any>(null);
    const [sourceActivity, destinationActivity] = selectedActivityPair.split(' - ');

    useEffect(() => {
        const url = `http://154.56.63.127:5000/case_overview/${jobId}/${sourceActivity}/${destinationActivity}`;
        fetch(url)
            .then(response => response.json())
            .then(jsonData => setData(jsonData))
            .catch(error => console.error(`Error fetching data from ${url}: `, error));
    }, [jobId, sourceActivity, destinationActivity]);

    if (!data) {
        return <div>Loading...</div>;
    }

    const caseFrequencyOptions = {
        title: {
            text: null
        },
        series: [{
            type: 'pie',
            data: [
                ['Specific Case Count', data.specific_case_count],
                ['Total Case Count', data.total_case_count]
            ]
        }]
    };

    const waitingTimeOptions = {
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
                ['Specific Waiting Time', data.specific_wttotal_sum],
                ['Total Waiting Time', data.total_wttotal_sum]
            ]
        }]
    };

    const highestSource = Object.entries(data.specific_sums).reduce<{ key: string, value: number }>((acc, [key, value]) => {
        return (value as number) > acc.value ? { key, value: value as number } : acc;
    }, { key: '', value: 0 });

    let causeText = "No highest cause";
    let valueText = "0";

    if (highestSource.key) {
        valueText = dhmToString(secondsToDhm(highestSource.value));
        switch (highestSource.key) {
            case "contention_wt":
                causeText = "Resource Contention";
                break;
            case "batching_wt":
                causeText = "Batching";
                break;
            case "prioritization_wt":
                causeText = "Prioritization";
                break;
            case "unavailability_wt":
                causeText = "Resource Unavailability";
                break;
            case "extraneous_wt":
                causeText = "Extraneous Factors";
                break;
            default:
                causeText = highestSource.key;
                break;
        }
    }

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
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Case Frequency</div>
                        <div>{data.specific_case_count} / {data.total_case_count}</div>
                        <HighchartsReact highcharts={Highcharts} options={caseFrequencyOptions} />
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Waiting Time in Transition</div>
                        <div>{data.specific_wttotal_sum === 0 ? "0" : dhmToString(secondsToDhm(data.specific_wttotal_sum))}</div>
                        <HighchartsReact highcharts={Highcharts} options={waitingTimeOptions} />
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Highest Source</div>
                        <div>Cause: {causeText}</div>
                        <div>{valueText}</div>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );

};

export default SpecificTransitionLayout;
