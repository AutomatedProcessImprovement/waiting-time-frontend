// import * as React from 'react';
// import * as Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import { Card } from '@mui/material';
// import moment from 'moment';
// import { secondsToDhm } from '../../../helpers/SecondsToDhm';
// import { dhmToString } from '../../../helpers/dhmToString';
//
// const _colorDict = {
//     batching: "#6C8EBF",
//     prioritization: "#B8544F",
//     contention: "#D7B500",
//     unavailability: "#63B7B0",
//     extraneous: "#B3B3B3",
// };
//
//
// interface WaitingTimeframeProps {
//     jobId: string;
//     sourceActivity?: string;
//     destinationActivity?: string;
//     wtType?: string;
// }
//
//
// const WaitingTimeframe: React.FC<WaitingTimeframeProps> = ({ jobId, sourceActivity, destinationActivity, wtType }) => {
//     const [chartData, setChartData] = React.useState<any[]>([]);
//     const [timeUnit, setTimeUnit] = React.useState<moment.unitOfTime.StartOf>('day');
//
//     const aggregateData = (data: any[], timeUnit: moment.unitOfTime.StartOf) => {
//         const aggregatedData: any = {};
//         data.forEach((dayData: any) => {
//             const key = moment(dayData.day).startOf(timeUnit).format('YYYY-MM-DD');
//             if (!aggregatedData[key]) {
//                 aggregatedData[key] = { ...dayData };
//             } else {
//                 Object.keys(dayData).forEach((field) => {
//                     if (field !== 'day') {
//                         aggregatedData[key][field] += dayData[field];
//                     }
//                 });
//             }
//         });
//         return Object.values(aggregatedData);
//     };
//
//     const handleTimeUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const newTimeUnit = e.target.value as moment.unitOfTime.StartOf;
//         setTimeUnit(newTimeUnit);
//         const aggregatedData = aggregateData(chartData, newTimeUnit);
//         setChartData(aggregatedData);
//     };
//
//     React.useEffect(() => {
//         let url = `http://154.56.63.127:5000/daily_summary/${jobId}`;
//
//         if (sourceActivity && destinationActivity) {
//             url = `http://154.56.63.127:5000/daily_summary/${jobId}/${sourceActivity}/${destinationActivity}`;
//         }
//
//         fetch(url)
//             .then((response) => response.json())
//             .then((data) => {
//                 const aggregatedData = aggregateData(data, timeUnit);
//                 setChartData(aggregatedData);
//             })
//             .catch((error) => {
//                 console.error("Error fetching data: ", error);
//             });
//     }, [jobId, sourceActivity, destinationActivity, timeUnit]);
//
//     const options = {
//         chart: {
//             type: 'areaspline',
//             zoomType: 'x',
//         },
//         title: {
//             text: 'Waiting time causes over the timeframe',
//             align: 'center',
//             style: {
//                 fontFamily: 'Roboto'
//             }
//         },
//         xAxis: {
//             categories: chartData.map((data) => data.day),
//             title: {
//                 text: 'Time Unit',
//                 align: 'middle',
//             },
//         },
//         yAxis: {
//             title: {
//                 text: 'Waiting Time',
//             },
//             labels: {
//                 formatter: function (this: any): string {
//                     return dhmToString(secondsToDhm(this.value));
//                 },
//             },
//         },
//         tooltip: {
//             split: true,
//         },
//         plotOptions: {
//             area: {
//                 stacking: 'normal',
//             },
//         },
//         series: [
//             {
//                 name: 'Batching',
//                 data: chartData.map((data) => data.total_batching_wt),
//                 color: _colorDict.batching,
//                 tooltip: {
//                     pointFormatter: function (this: Highcharts.Point): string {
//                         const formattedValue = dhmToString(secondsToDhm(this.y as any));
//                         return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
//                     },
//                 },
//             },
//             {
//                 name: 'Prioritization',
//                 data: chartData.map((data) => data.total_prioritization_wt),
//                 color: _colorDict.prioritization,
//                 tooltip: {
//                     pointFormatter: function (this: Highcharts.Point): string {
//                         const formattedValue = dhmToString(secondsToDhm(this.y as any));
//                         return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
//                     },
//                 },
//             },
//             {
//                 name: 'Contention',
//                 data: chartData.map((data) => data.total_contention_wt),
//                 color: _colorDict.contention,
//                 tooltip: {
//                     pointFormatter: function (this: Highcharts.Point): string {
//                         const formattedValue = dhmToString(secondsToDhm(this.y as any));
//                         return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
//                     },
//                 },
//             },
//             {
//                 name: 'Unavailability',
//                 data: chartData.map((data) => data.total_unavailability_wt),
//                 color: _colorDict.unavailability,
//                 tooltip: {
//                     pointFormatter: function (this: Highcharts.Point): string {
//                         const formattedValue = dhmToString(secondsToDhm(this.y as any));
//                         return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
//                     },
//                 },
//             },
//             {
//                 name: 'Extraneous',
//                 data: chartData.map((data) => data.total_extraneous_wt),
//                 color: _colorDict.extraneous,
//                 tooltip: {
//                     pointFormatter: function (this: Highcharts.Point): string {
//                         const formattedValue = dhmToString(secondsToDhm(this.y as any));
//                         return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
//                     },
//                 },
//             },
//         ],
//     };
//
//
//     return (
//         <Card>
//             <div>
//                 <label htmlFor="timeUnit">Time Unit: </label>
//                 <select id="timeUnit" onChange={handleTimeUnitChange} value={timeUnit as string}>
//                     <option value="day">Day</option>
//                     <option value="week">Week</option>
//                     <option value="month">Month</option>
//                     <option value="year">Year</option>
//                 </select>
//             </div>
//             <HighchartsReact highcharts={Highcharts} options={options} />
//         </Card>
//     );
// };
//
// export default WaitingTimeframe;


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

const WaitingTimeframe = ({jobId, sourceActivity, destinationActivity, wtType}: {
    jobId: string;
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
                    name: wtType,
                    data: data.map(d => d[`total_${wtType}_wt`]),
                    color: _colorDict[wtType],
                    tooltip: {pointFormatter: generateTooltipFormatter(wtType)}
                },
                {
                    name: 'Other Types',
                    data: data.map(d => otherTypes.reduce((acc, type) => acc + d[`total_${type}_wt`], 0)),
                    color: '#999',
                    tooltip: {
                        pointFormatter: function (this: Highcharts.Point): string {
                            const formattedValue = dhmToString(secondsToDhm(this.y as any));
                            return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formattedValue}</b><br/>`;
                        },
                    },
                }
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

    const endpoint = sourceActivity && destinationActivity
        ? `/daily_summary/${jobId}/${sourceActivity}/${destinationActivity}`
        : `/daily_summary/${jobId}`;
    const data = useFetchData(endpoint);

    React.useEffect(() => {
        if (data) {
            const aggregatedData = aggregateData(data, timeUnit);
            setChartData(aggregatedData);
        }
    }, [data, timeUnit]);

    const options = {
        chart: {
            type: 'areaspline',
            zoomType: 'x',
        },
        title: {
            text: 'Waiting time causes over the timeframe',
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
