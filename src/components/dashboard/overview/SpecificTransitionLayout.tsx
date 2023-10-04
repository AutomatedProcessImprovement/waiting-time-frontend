import React from 'react';
import {Box, Grid} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {secondsToDhm} from '../../../helpers/SecondsToDhm';
import {dhmToString} from '../../../helpers/dhmToString';
import {useFetchData} from '../../../helpers/useFetchData';
import TransitionsBarChart from './TransitionsBarChart';
import WaitingTimeframe from "./WaitingTimeframe";
import GaugeChart from "./GaugeChart";
import PotentialCteChart from "./PotentialCteChart";

interface SpecificTransitionLayoutProps {
    jobId: string;
    selectedActivityPair: string;
}

const SpecificTransitionLayout: React.FC<SpecificTransitionLayoutProps> = ({jobId, selectedActivityPair}) => {
    const [sourceActivity, destinationActivity] = selectedActivityPair.split(' - ');

    const overviewData = useFetchData(`/case_overview/${jobId}/${sourceActivity}/${destinationActivity}`);
    const barChartData = useFetchData(`/activity_transitions/${jobId}/${sourceActivity}/${destinationActivity}`);
    const barChartDataByResource = useFetchData(`/activity_transitions_by_resource/${jobId}/${sourceActivity}/${destinationActivity}`);
    const potentialCteData = useFetchData(`/potential_cte_filtered/${jobId}/${sourceActivity}/${destinationActivity}`);

    if (!overviewData || !barChartData || !barChartDataByResource || !potentialCteData) {
        return <div>Loading...</div>;
    }

    if (overviewData && overviewData.specific_case_count == 0 && overviewData.specific_wttotal_sum == null) {
        return <strong>This transition has no waiting time</strong>;
    }

    const specificCte = +parseFloat(((overviewData.processing_time / (overviewData.specific_wttotal_sum + overviewData.processing_time)) * 100).toFixed(1))
    const isMaxPairDefined = overviewData.max_wttotal_pair && overviewData.max_wttotal_pair[2] !== 0;
    const highestSourceText = isMaxPairDefined
        ? `Handover: ${overviewData.max_wttotal_pair[0]} - ${overviewData.max_wttotal_pair[1]}\n${dhmToString(secondsToDhm(overviewData.max_wttotal_pair[2]))}`
        : 'No highest handover';

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
                ['Specific Case Count', overviewData.specific_case_count],
                ['Total Case Count', overviewData.total_case_count - overviewData.specific_case_count]
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
            pointFormatter: function (this: any) {
                return `${this.series.name}: <b>${dhmToString(secondsToDhm(this.y))}</b>`;
            }
        },
        series: [{
            type: 'pie',
            data: [
                ['Specific Waiting Time', overviewData.specific_wttotal_sum],
                ['Total Waiting Time', overviewData.total_wttotal_sum]
            ]
        }]
    };

    const highestSource = Object.entries(overviewData.specific_sums).reduce<{
        key: string,
        value: number
    }>((acc, [key, value]) => {
        return (value as number) > acc.value ? {key, value: value as number} : acc;
    }, {key: '', value: 0});

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
                    <div style={{
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc'
                    }}>
                        <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>Case Frequency</div>
                        <div>{overviewData.specific_case_count} / {overviewData.total_case_count}</div>
                        <div style={{width: '100%', height: '300px'}}>
                            <HighchartsReact highcharts={Highcharts} options={caseFrequencyOptions}/>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc'
                    }}>
                        <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>Waiting Time in Transition</div>
                        <div>{overviewData.specific_wttotal_sum === 0 ? "0" : dhmToString(secondsToDhm(overviewData.specific_wttotal_sum))}</div>
                        <div style={{width: '100%', height: '300px'}}>
                            <HighchartsReact highcharts={Highcharts} options={waitingTimeOptions}/>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc'
                    }}>
                        <div style={{fontWeight: 'bold', fontSize: '1.2em', marginBottom: '20px'}}>Highest Source</div>
                        <div style={{textAlign: 'left'}}>Cause: {causeText}</div>
                        <div style={{textAlign: 'left'}}>{valueText}</div>
                        <div style={{textAlign: 'left', whiteSpace: 'pre-line'}}>{highestSourceText}</div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <TransitionsBarChart data={barChartData}/>
                </Grid>
                <Grid item xs={12}>
                    <WaitingTimeframe
                        jobId={jobId}
                        sourceActivity={sourceActivity}
                        destinationActivity={destinationActivity}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TransitionsBarChart data={barChartDataByResource}/>
                </Grid>
                <Grid item xs={4}>
                    <GaugeChart value={specificCte}/>
                </Grid>
                <Grid item xs={8}>
                    <PotentialCteChart jsonData={potentialCteData} cte={specificCte}/>
                </Grid>
            </Grid>
        </Box>
    );

};

export default SpecificTransitionLayout;
