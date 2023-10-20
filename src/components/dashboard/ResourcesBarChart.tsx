import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, Select, MenuItem } from '@mui/material';
import {secondsToDhm} from "../../helpers/SecondsToDhm";
import {dhmToString} from "../../helpers/dhmToString";

interface ResourcesBarChartProps {
    data: Array<any>;
    selectedWt: keyof ColorDictType;
    selectedActivity?: string;
}

type ColorDictType = {
    batching: string;
    prioritization: string;
    contention: string;
    unavailability: string;
    extraneous: string;
};

const colorDict: ColorDictType = {
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
};

export default function ResourcesBarChart({ data, selectedWt, selectedActivity: propSelectedActivity }: ResourcesBarChartProps) {
    const [localSelectedActivity, setLocalSelectedActivity] = useState<string>('');

    useEffect(() => {
        if (propSelectedActivity && data.some(item => item.activity === propSelectedActivity)) {
            setLocalSelectedActivity(propSelectedActivity);
        } else if (data.length > 0) {
            setLocalSelectedActivity(data[0].activity);
        }
    }, [data, propSelectedActivity]);

    const filteredData = data.filter(item => item.activity === localSelectedActivity);
    const categories = filteredData.map(item => item.resource);
    const seriesData = filteredData.map(item => item[`${selectedWt}_wt`]);

    const uniqueActivities = Array.from(new Set(data.map(item => item.activity)));

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: null,
        },
        xAxis: {
            categories: categories,
            title: {
                text: 'Resources'
            }
        },
        yAxis: {
            title: {
                text: 'Time'
            },
            labels: {
                formatter(this: any) {
                    const [y, d, h, m] = secondsToDhm(this.value);
                    return dhmToString([y, d, h, m]);
                }
            }
        },
        tooltip: {
            formatter(this: any) {
                const [y, d, h, m] = secondsToDhm(this.y);
                return `${this.series.name}: ${dhmToString([y, d, h, m])}`;
            }
        },
        series: [{
            name: selectedWt,
            data: seriesData,
            color: colorDict[selectedWt]
        }]
    };

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <h3 style={{ margin: 0 }}>Activity: {localSelectedActivity}</h3>
                <Select value={localSelectedActivity} onChange={e => setLocalSelectedActivity(e.target.value as string)}>
                    {uniqueActivities.map(activity => (
                        <MenuItem key={activity} value={activity}>{activity}</MenuItem>
                    ))}
                </Select>
            </div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </Card>
    );
}
