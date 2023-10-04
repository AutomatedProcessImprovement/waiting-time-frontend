import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Card} from '@mui/material';

interface BarChartBoxProps {
    jsonData: {
        [key: string]: number;
    };
    cte: number;
}

const colorDict: { [key: string]: string } = {
    Batching: "#6C8EBF",
    Prioritization: "#B8544F",
    Contention: "#D7B500",
    Unavailability: "#63B7B0",
    Extraneous: "#B3B3B3",
};

export default function PotentialCteChart({ jsonData, cte }: BarChartBoxProps) {
    const categories = Object.keys(jsonData);
    const series = categories.map(category => ({
        name: category,
        data: [jsonData[category]],
        color: colorDict[category],
    }));

    const options = {
        chart: {
            type: 'column',
            marginLeft: 200,
            style: {
                fontFamily: 'Roboto',
                fontSize: 18,
            },
        },
        title: {
            text: 'Potential CTE Causes',
            align: 'left',
            style: {
                fontFamily: 'Roboto',
            },
        },
        xAxis: {
            categories: ['Reasons'],
        },
        yAxis: {
            title: {
                text: '',
            },
            plotLines: [{
                color: 'red',
                width: 2,
                value: cte,
                label: {
                    text: `CTE Value: ${cte}%`,
                    align: 'left',
                    x: -175
                },
            }],
        },
        series,
    };

    return (
        <Card sx={{ minWidth: 500, minHeight: 450, zIndex: 100 }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </Card>
    );
}
