import React from 'react';
import {Box, Grid, Typography} from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {dhmToString} from "../../../helpers/dhmToString";
import {secondsToDhm} from "../../../helpers/SecondsToDhm";
import {useFetchData} from "../../../helpers/useFetchData";
import WaitingTimeframe from "../overview/WaitingTimeframe";
import TransitionsBarChart from "../overview/TransitionsBarChart";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";


interface BatchingAllTransitionsLayoutProps {
    jobId: string;
}

const BatchingAllTransitionsLayout: React.FC<BatchingAllTransitionsLayoutProps> = ({jobId}) => {
    const overviewData = useFetchData(`/wt_overview/${jobId}/batching`);
    const transitionsData = useFetchData(`/activity_transitions/${jobId}`);
    const timeFrameData = useFetchData(`/daily_summary/${jobId}`);
    const activityWT = useFetchData(`/activity_wt/${jobId}`);

    if (!overviewData || !transitionsData || !timeFrameData) {
        return <div>Loading...</div>;
    }

    const caseFrequencyOptions = {
        chart: {
            height: 300,
        },
        title: {
            text: null
        },
        colors: ['#6C8EBF', 'lightblue'],
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
        colors: ['#6C8EBF', 'lightblue'],
        tooltip: {
            pointFormatter: function (this: any) {
                return `${this.series.name}: <b>${dhmToString(secondsToDhm(this.y))}</b>`;
            }
        },
        series: [{
            type: 'pie',
            data: [
                ['Batching WT', overviewData.wt_sum],
                ['Total WT', overviewData.total_wt_sum]
            ]
        }]
    };

    const biggestSourceDestPair = `${overviewData.biggest_source_dest_pair[0]} - ${overviewData.biggest_source_dest_pair[1]}`;
    const valueText = dhmToString(secondsToDhm(overviewData.biggest_source_dest_pair[2]));
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
                    <div style={{
                        textAlign: 'center',
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #ccc'
                    }}>
                        <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>Affected Cases</div>
                        <div>{overviewData.distinct_cases} / {overviewData.cases}</div>
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
                        <div style={{fontWeight: 'bold', fontSize: '1.2em'}}>WT due to Batching</div>
                        <div>{overviewData.wt_sum === 0 ? "0" : dhmToString(secondsToDhm(overviewData.wt_sum))}</div>
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
                        <div style={{textAlign: 'left'}}>Transition: {biggestSourceDestPair}</div>
                        <div style={{textAlign: 'left', marginBottom: '20px'}}>{valueText}</div>
                        <div style={{textAlign: 'left', whiteSpace: 'pre-line'}}>Resource: {highestSourceText}</div>
                        <div style={{textAlign: 'left', whiteSpace: 'pre-line'}}>{highestSourceValue}</div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" style={{ marginRight: '8px' }}>
                            Waiting time over the timeframe
                        </Typography>
                    </div>
                    <WaitingTimeframe
                        data={timeFrameData}
                        wtType={"batching"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" style={{ marginRight: '8px' }}>
                            Waiting time in transitions
                        </Typography>

                        <Tooltip
                            title={
                                <span style={{ fontSize: '1rem' }}>
                            Waiting time between pairs of consecutive activities categorized by the causes of waiting.
                        </span>
                            }
                        >
                            <IconButton size="small" aria-label="info about waiting time causes">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <TransitionsBarChart data={transitionsData} selectedWTType={"batching"}/>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h6" style={{ marginRight: '8px' }}>
                            Sum of waiting times before activities
                        </Typography>

                        <Tooltip
                            title={
                                <span style={{ fontSize: '1rem' }}>
                            The sum of all transitions (waiting times) incoming in each activity. Indicates which activities could be bottlenecks in the process.
                        </span>
                            }
                        >
                            <IconButton size="small" aria-label="info about waiting time causes">
                                <HelpOutlineIcon />
                            </IconButton>
                        </Tooltip>
                    </div>
                    <TransitionsBarChart data={activityWT} selectedWTType={"batching"}/>
                </Grid>
            </Grid>
        </Box>
    );
}

export default BatchingAllTransitionsLayout;