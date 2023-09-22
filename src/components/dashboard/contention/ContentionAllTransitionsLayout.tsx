import React, {useEffect, useState} from 'react';
import {Box, Grid} from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import {dhmToString} from "../../../helpers/dhmToString";
import {secondsToDhm} from "../../../helpers/SecondsToDhm";
import WaitingTimeframe from "../overview/WaitingTimeframe";
import TransitionsBarChart from "../overview/TransitionsBarChart";


interface ContentionAllTransitionsLayout {
    jobId: string;
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

const ContentionAllTransitionsLayout: React.FC<ContentionAllTransitionsLayout> = ({ jobId }) => {
    const overviewData = useFetchData(`http://154.56.63.127:5000/wt_overview/${jobId}/contention`);
    const transitionsData = useFetchData(`http://154.56.63.127:5000/activity_transitions/${jobId}`);

    if (!overviewData || !transitionsData) {
        return <div>Loading...</div>;
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
                ['Contetion WT', overviewData.wt_sum],
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
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>WT due to Contention</div>
                        <div>{overviewData.wt_sum === 0 ? "0" : dhmToString(secondsToDhm(overviewData.wt_sum))}</div>
                        <div style={{ width: '100%', height: '300px' }}>
                            <HighchartsReact highcharts={Highcharts} options={waitingTimeOptions} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={4}>
                    <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '20px' }}>Highest Source</div>
                        <div style={{ textAlign: 'left' }}>Transition: {biggestSourceDestPair}</div>
                        <div style={{ textAlign: 'left', marginBottom: '20px' }}>{valueText}</div>
                        <div style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>{highestSourceText}</div>
                        <div style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>{highestSourceValue}</div>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <WaitingTimeframe
                        jobId={jobId}
                        wtType={"contention"}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TransitionsBarChart data={transitionsData} selectedWTType={"contention"}/>
                </Grid>
            </Grid>
        </Box>
    );
}

export default ContentionAllTransitionsLayout;