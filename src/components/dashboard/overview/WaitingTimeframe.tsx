import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {Card} from '@mui/material';
import moment from 'moment';
import {secondsToDhm} from '../../../helpers/SecondsToDhm';
import {dhmToString} from '../../../helpers/dhmToString';
import {useFetchData} from "../../../helpers/useFetchData";

const _colorDict = {
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
};

type WTType = keyof typeof _colorDict;

const WaitingTimeframe = ({data, sourceActivity, destinationActivity, wtType}: {
    data: any;
    sourceActivity?: string;
    destinationActivity?: string;
    wtType?: WTType
}) => {
    const [chartData, setChartData] = React.useState<any[]>([]);
    const [timeUnit, setTimeUnit] = React.useState<moment.unitOfTime.StartOf>('day');

    const aggregateData = (data: any[], timeUnit: moment.unitOfTime.StartOf) => {
        const aggregatedData: any = {};
        data.forEach((dayData: any) => {
            const key = moment(dayData.day).startOf(timeUnit).format('YYYY-MM-DD');
            if (!aggregatedData[key]) {
                aggregatedData[key] = {...dayData};
            } else {
                Object.keys(dayData).forEach((field) => {
                    if (field !== 'day') {
                        aggregatedData[key][field] += dayData[field];
                    }
                });
            }
        });
        return Object.values(aggregatedData);
    };

    const generateSeries = (data: any[]) => {
        if (wtType && _colorDict[wtType]) {
            const otherTypes = Object.keys(_colorDict).filter(key => key !== wtType);
            return [
                {
                    name: 'Other Types',
                    data: data.map(d => otherTypes.reduce((acc, type) => acc + d[`total_${type}_wt`], 0)),
                    color: 'lightblue',
                    tooltip: {
                        pointFormatter: function (this: Highcharts.Point): string {
                            const formattedValue = dhmToString(secondsToDhm(this.y as any));
                            return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
                        },
                    },
                },
                {
                    name: wtType,
                    data: data.map(d => d[`total_${wtType}_wt`]),
                    color: _colorDict[wtType],
                    tooltip: {pointFormatter: generateTooltipFormatter(wtType)}
                },
            ];
        } else {
            return Object.keys(_colorDict).map((type) => {
                const key = type as WTType;
                return {
                    name: key,
                    data: data.map(d => d[`total_${key}_wt`]),
                    color: _colorDict[key],
                    tooltip: {pointFormatter: generateTooltipFormatter(key)}
                };
            });
        }
    };

    const generateTooltipFormatter = (type: string) => {
        return function (this: Highcharts.Point): string {
            const formattedValue = dhmToString(secondsToDhm(this.y as any));
            return `<span style="color:${this.color}">\u25CF</span> ${type}: <b>${formattedValue}</b><br/>`;
        };
    };

    const handleTimeUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTimeUnit = e.target.value as moment.unitOfTime.StartOf;
        setTimeUnit(newTimeUnit);
        const aggregatedData = aggregateData(chartData, newTimeUnit);
        setChartData(aggregatedData);
    };

    // const endpoint = sourceActivity && destinationActivity
    //     ? `/daily_summary/${jobId}/${sourceActivity}/${destinationActivity}`
    //     : `/daily_summary/${jobId}`;
    // const data = useFetchData(endpoint);

    React.useEffect(() => {
        if (data) {
            const aggregatedData = aggregateData(data, timeUnit);
            setChartData(aggregatedData);
        }
    }, [data, timeUnit]);

    const options = {
        chart: {
            type: 'area',
            zoomType: 'x',
        },
        title: {
            text: '',
            align: 'center',
            style: {
                fontFamily: 'Roboto'
            }
        },
        xAxis: {
            categories: chartData.map((data) => data.day),
            title: {
                text: 'Time Unit',
                align: 'middle',
            },
        },
        yAxis: {
            title: {
                text: 'Waiting Time',
            },
            labels: {
                formatter: function (this: any): string {
                    return dhmToString(secondsToDhm(this.value));
                },
            },
        },
        tooltip: {
            split: true,
        },
        plotOptions: {
            area: {
                stacking: 'normal',
            },
        },
        series: generateSeries(chartData),
    };

    return (
        <Card>
            <div>
                <label htmlFor="timeUnit">Time Unit: </label>
                <select id="timeUnit" onChange={handleTimeUnitChange} value={timeUnit as string}>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </div>
            <HighchartsReact highcharts={Highcharts} options={options}/>
        </Card>
    );
};

export default WaitingTimeframe;
