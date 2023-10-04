import React, {useState} from 'react';
import {Box, FormControl, Grid, InputLabel, MenuItem, Select} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Infobox from "../Infobox";
import PieChartBox from "../PieChartBox";
import WaitingTimeframe from "./WaitingTimeframe";
import TransitionsBarChart from "./TransitionsBarChart";
import TransitionsTable from "./TransitionsTable";
import {secondsToDhm} from '../../../helpers/SecondsToDhm';
import {dhmToString} from '../../../helpers/dhmToString';
import {useFetchData} from '../../../helpers/useFetchData'
import GaugeChart from './GaugeChart';
import PotentialCteChart from './PotentialCteChart';
import CTEHeatmap from "./CTEHeatmap";
import CTETable from "./CTETable";

interface AllTransitionsLayoutProps {
    jobId: string;
}

const AllTransitionsLayout: React.FC<AllTransitionsLayoutProps> = ({ jobId }) => {
    const overviewData = useFetchData(`/overview/${jobId}`);
    const transitionsData = useFetchData(`/activity_transitions/${jobId}`);
    const potentialCteData = useFetchData(`/potential_cte/${jobId}`);
    const [showTable, setShowTable] = useState(false);
    const [showTable2, setShowTable2] = useState(false);
    const [displayMode, setDisplayMode] = useState("total");
    const [pieChartDisplayMode, setPieChartDisplayMode] = useState("total");

    if (!overviewData || !transitionsData) {
        return <div>Loading...</div>;
    }

    const toggleTable = () => setShowTable(!showTable);
    const toggleTable2 = () => setShowTable2(!showTable2);

    if (!overviewData || !transitionsData) {
        return <div>Loading...</div>;
    }

    const visData = pieChartDisplayMode === "total"
        ? [
            {
                name: 'Extraneous',
                value: overviewData.sums.total_extraneous_wt,
                label: "EXTRANEOUS\n" + dhmToString(secondsToDhm(overviewData.sums.total_extraneous_wt))
            },
            {
                name: 'Batching',
                value: overviewData.sums.total_batching_wt,
                label: "BATCHING\n" + dhmToString(secondsToDhm(overviewData.sums.total_batching_wt))
            },
            {
                name: 'Resource Unavailability',
                value: overviewData.sums.total_unavailability_wt,
                label: "UNAVAILABILITY\n" + dhmToString(secondsToDhm(overviewData.sums.total_unavailability_wt))
            },
            {
                name: 'Resource Contention',
                value: overviewData.sums.total_contention_wt,
                label: "CONTENTION\n" + dhmToString(secondsToDhm(overviewData.sums.total_contention_wt))
            },
            {
                name: 'Prioritization',
                value: overviewData.sums.total_prioritization_wt,
                label: "PRIORITIZATION\n" + dhmToString(secondsToDhm(overviewData.sums.total_prioritization_wt))
            }
        ]
        : [
            {
                name: 'Extraneous',
                value: overviewData.avg.avg_extraneous_wt,
                label: "EXTRANEOUS\n" + dhmToString(secondsToDhm(overviewData.avg.avg_extraneous_wt))
            },
            {
                name: 'Batching',
                value: overviewData.avg.avg_batching_wt,
                label: "BATCHING\n" + dhmToString(secondsToDhm(overviewData.avg.avg_batching_wt))
            },
            {
                name: 'Resource Unavailability',
                value: overviewData.avg.avg_unavailability_wt,
                label: "UNAVAILABILITY\n" + dhmToString(secondsToDhm(overviewData.avg.avg_unavailability_wt))
            },
            {
                name: 'Resource Contention',
                value: overviewData.avg.avg_contention_wt,
                label: "CONTENTION\n" + dhmToString(secondsToDhm(overviewData.avg.avg_contention_wt))
            },
            {
                name: 'Prioritization',
                value: overviewData.avg.avg_prioritization_wt,
                label: "PRIORITIZATION\n" + dhmToString(secondsToDhm(overviewData.avg.avg_prioritization_wt))
            }
        ];

    const cycleTimeData = displayMode === "average"
        ? [
            ['Waiting Time', overviewData.waiting_time_avg],
            ['Processing Time', overviewData.processing_time_avg]
        ]
        : [
            ['Waiting Time', overviewData.waiting_time],
            ['Processing Time', overviewData.processing_time]
        ];

    const cycleTimeOptions = {
        title: {
            text: ''
        },
        tooltip: {
            pointFormatter: function(this: any) {
                return `${this.series.name}: <b>${dhmToString(secondsToDhm(this.y))}</b>`;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Time',
            data: cycleTimeData
        }]
    };

    const totalCycleTime = overviewData.waiting_time + overviewData.processing_time;
    const processingTimePercentage = +parseFloat(((overviewData.processing_time / totalCycleTime) * 100).toFixed(1))
    let avgCycleTime = overviewData.processing_time_avg + overviewData.waiting_time_avg;

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
                <Grid item xs={2}>
                    <Grid container
                          spacing={3}
                          direction="column"
                          justifyContent="flex-start"
                          alignItems="stretch"
                    >
                        <Grid item>
                            <Infobox data={{
                                title: "Cases",
                                subtitle: "Total number of cases with wt",
                                value: Intl.NumberFormat('en-US').format(overviewData.num_cases)
                            }}/>
                        </Grid>
                        <Grid item>
                            <Infobox data={{
                                title: "Activities",
                                subtitle: "Total number of activities",
                                value: Intl.NumberFormat('en-US').format(overviewData.num_activities)
                            }}/>
                        </Grid>
                        <Grid item>
                            <Infobox data={{
                                title: "Transitions",
                                value: Intl.NumberFormat('en-US').format(overviewData.num_transitions)
                            }}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <div style={{ fontSize: 'large', marginBottom: '5px' }}>
                                Cycle Time
                            </div>

                            <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                                <FormControl variant="outlined" size="small" style={{ marginBottom: '10px' }}>
                                    <InputLabel>Data Mode</InputLabel>
                                    <Select
                                        value={displayMode}
                                        onChange={(event) => setDisplayMode(event.target.value)}
                                        label="Data Mode"
                                    >
                                        <MenuItem value={"total"}>Total</MenuItem>
                                        <MenuItem value={"average"}>Average</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <div style={{ fontSize: 'small', marginBottom: '10px' }}>
                            {displayMode === "total"
                                ? `Total Cycle Time: ${dhmToString(secondsToDhm(totalCycleTime))}`
                                : `Average Cycle Time: ${dhmToString(secondsToDhm(avgCycleTime))}`}
                        </div>

                        <HighchartsReact key={displayMode} highcharts={Highcharts} options={cycleTimeOptions} />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <div style={{ fontSize: 'large' }}>
                                Waiting Times Distribution
                            </div>

                            <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                                <FormControl variant="outlined" size="small" style={{ marginBottom: '10px' }}>
                                    <InputLabel>Data Mode</InputLabel>
                                    <Select
                                        value={pieChartDisplayMode}
                                        onChange={(event) => setPieChartDisplayMode(event.target.value)}
                                        label="Data Mode"
                                    >
                                        <MenuItem value={"total"}>Total</MenuItem>
                                        <MenuItem value={"average"}>Average</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <PieChartBox key={pieChartDisplayMode} data={visData}/>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <WaitingTimeframe jobId={jobId}/>
                </Grid>
                <Grid item xs={12}>
                    <TransitionsBarChart data={transitionsData}/>
                </Grid>
                <Grid item xs={12} style={{textAlign: 'center'}}>
                <span onClick={toggleTable}
                      style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: 'blue'}}>
                    View as a table
                    {showTable ?
                        <ArrowDropUpIcon style={{verticalAlign: 'middle', fontSize: '1.5rem'}}/> :
                        <ArrowDropDownIcon style={{verticalAlign: 'middle', fontSize: '1.5rem'}}/>
                    }
                </span>
                </Grid>
                {showTable && (
                    <Grid item xs={12}>
                        <TransitionsTable jobId={jobId}/>
                    </Grid>
                )}
                <Grid item xs={4}>
                    <GaugeChart value={processingTimePercentage} />
                </Grid>
                <Grid item xs={8}>
                    <PotentialCteChart jsonData={potentialCteData} cte={processingTimePercentage} />
                </Grid>
                <Grid item xs={12}>
                    <CTEHeatmap jobId={jobId}/>
                </Grid>
                <Grid item xs={12} style={{textAlign: 'center'}}>
                <span onClick={toggleTable2}
                      style={{cursor: 'pointer', display: 'inline-flex', alignItems: 'center', color: 'blue'}}>
                    View as a table
                    {showTable2 ?
                        <ArrowDropUpIcon style={{verticalAlign: 'middle', fontSize: '1.5rem'}}/> :
                        <ArrowDropDownIcon style={{verticalAlign: 'middle', fontSize: '1.5rem'}}/>
                    }
                </span>
                </Grid>
                {showTable2 && (
                    <Grid item xs={12}>
                        <CTETable jobId={jobId}/>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}

export default AllTransitionsLayout;