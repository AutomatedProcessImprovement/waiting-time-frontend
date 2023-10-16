// import React from 'react';
// import HighchartsReact from "highcharts-react-official";
// import * as Highcharts from "highcharts";
// import stockInit from "highcharts/modules/stock"
// import {secondsToDhm} from "../../../helpers/SecondsToDhm";
// import {dhmToString} from "../../../helpers/dhmToString";
// require("moment-duration-format");
//
// stockInit(Highcharts)
//
// const _colorDict = {
//     batching: "#6C8EBF",
//     prioritization: "#B8544F",
//     contention: "#D7B500",
//     unavailability: "#63B7B0",
//     extraneous: "#B3B3B3",
// }
// const COLORS = [_colorDict.batching, _colorDict.prioritization, _colorDict.contention, _colorDict.unavailability, _colorDict.extraneous]
//
// type WTType = keyof typeof _colorDict;
//
// interface Props {
//     data: any;
//     selectedWTType?: WTType;
// }
//
// function TransitionsBarChart({ data, selectedWTType }: Props) {
//     let dataArray = [];
//     if (Array.isArray(data.data) && data.data.length > 0) {
//         dataArray = data.data;
//     } else if (data.data) {
//         dataArray = [data.data];
//     } else {
//         return <div>No data available</div>;
//     }
//
//     const isActivityType = dataArray.length > 0 && dataArray[0].hasOwnProperty('source_activity');
//     console.log(isActivityType);
//
//     let processed_data = []
//     let pre_categories = []
//     let categories = [] as string[]
//     if (isActivityType) {
//         for (const dataKey in dataArray) {
//             let out = {
//                 name: dataArray[dataKey].source_activity.trim().charAt(0).toUpperCase() + dataArray[dataKey].source_activity.trim().slice(1).toLowerCase() +
//                     ' - ' + dataArray[dataKey].target_activity.trim().charAt(0).toUpperCase() + dataArray[dataKey].target_activity.trim().slice(1).toLowerCase(),
//                 total_wt: dataArray[dataKey].total_wt,
//                 batching_wt :dataArray[dataKey].batching_wt,
//                 prioritization_wt :dataArray[dataKey].prioritization_wt,
//                 contention_wt :dataArray[dataKey].contention_wt,
//                 unavailability_wt :dataArray[dataKey].unavailability_wt,
//                 extraneous_wt :dataArray[dataKey].extraneous_wt,
//
//             }
//             pre_categories.push(out)
//         }
//     } else {
//         for (const dataKey in dataArray) {
//             let out = {
//                 name: dataArray[dataKey].source_resource.trim().charAt(0).toUpperCase() + dataArray[dataKey].source_resource.trim().slice(1).toLowerCase() +
//                     ' - ' + dataArray[dataKey].target_resource.trim().charAt(0).toUpperCase() + dataArray[dataKey].target_resource.trim().slice(1).toLowerCase(),
//                 total_wt: dataArray[dataKey].total_wt,
//                 batching_wt :dataArray[dataKey].batching_wt,
//                 prioritization_wt :dataArray[dataKey].prioritization_wt,
//                 contention_wt :dataArray[dataKey].contention_wt,
//                 unavailability_wt :dataArray[dataKey].unavailability_wt,
//                 extraneous_wt :dataArray[dataKey].extraneous_wt,
//
//             }
//             pre_categories.push(out)
//         }
//     }
//
//     let sorted_categories = pre_categories.sort(
//         (p1,p2) => (p1.total_wt < p2.total_wt ? 1 : (p1.total_wt > p2.total_wt) ? -1: 0)
//     )
//     for (const x in sorted_categories) {
//
//         categories.push(sorted_categories[x].name)
//     }
//
//     let batching = {
//         name: "Batching",
//         data: [] as number[]
//     }
//     let prio = {
//             name: "Prioritization",
//             data: [] as number[]
//     }
//     let conten = {
//             name: "Resource contention",
//             data: [] as number[]
//     }
//     let unav = {
//             name: "Resource unavailability",
//             data: [] as number[]
//     }
//     let extra = {
//             name: "Extraneous",
//             data: [] as number[]
//     }
//
//     for (const dataKey in sorted_categories) {
//         batching.data.push(Math.round(sorted_categories[dataKey].batching_wt))
//         prio.data.push(Math.round(sorted_categories[dataKey].prioritization_wt))
//         conten.data.push(Math.round(sorted_categories[dataKey].contention_wt))
//         unav.data.push(Math.round(sorted_categories[dataKey].unavailability_wt))
//         extra.data.push(Math.round(sorted_categories[dataKey].extraneous_wt))
//     }
//     processed_data.push(batching,prio,conten,unav,extra)
//
//     const baseHeight = 200;
//     const additionalHeightPerCategory = 50;
//     const maxHeight = 600;
//     const dynamicHeight = Math.min(maxHeight, baseHeight + (categories.length * additionalHeightPerCategory));
//
//     const options = {
//         b_totals: [],
//         colors: COLORS.reverse(),
//         chart: {
//             type: 'bar',
//             padding: [0, 0, 0, 0],
//             margin: [60, 50, 125, 250],
//             height: dynamicHeight,
//             style: {
//                 fontFamily: 'Roboto',
//                 fontSize: 18
//             }
//         },
//         title: {
//             text: 'Waiting time causes in activity transitions',
//             align: 'left'
//         },
//         subtitle: {
//             text: 'Total waiting time in activity transitions by its cause',
//             align: 'left'
//         },
//         xAxis: {
//             type: 'category',
//             categories: categories,
//             min: 0,
//             max: categories.length < 9 ? categories.length - 1 : 8,
//             scrollbar: {
//                 enabled: true
//             },
//             tickLength: 0
//         },
//         yAxis: {
//             title: {
//                 text: 'Time',
//                 align: 'high'
//             },
//             labels: {
//                 align: 'right',
//                 formatter(this: any) {
//                     const [y, d, h, m] = secondsToDhm(this.value);
//                     return dhmToString([y, d, h, m]);
//                 }
//             },
//             stackLabels: {
//                 align: 'right',
//                 x: 20,
//                 enabled: true,
//                 formatter(this: any) {
//                     const [y, d, h, m] = secondsToDhm(this.total);
//                     return dhmToString([y, d, h, m]);
//                 }
//             }
//         },
//         plotOptions: {
//             series: {
//                 stacking: 'normal',
//                 pointWidth: 20,
//                 dataLabels: {
//                     enabled: true,
//                     align: 'left',
//                     formatter(this: any) {
//                         if (this.point.stackTotal === 0) return null;
//                         const percentage = (this.y / this.point.stackTotal) * 100;
//                         return `${Math.round(percentage)}%`;
//                     },
//                     style: {
//                         fontSize: '10px',
//                     }
//                 },
//             },
//         },
//         legend: {
//             enabled: true,
//             reversed: true
//         },
//         tooltip: {
//             formatter(this: Highcharts.TooltipFormatterContextObject) {
//                 const [y, d, h, m] = secondsToDhm(this.y as number);
//                 const timeString = dhmToString([y, d, h, m]);
//                 return `${this.series.name}: ${timeString}`;
//             }
//         },
//
//         series: processed_data.reverse()
//     }
//
//     return (
//         <>
//             <HighchartsReact
//                 highcharts={Highcharts}
//                 options={options}
//             />
//         </>
//     )
// }
// export default TransitionsBarChart
//
//
// {/*<ResponsiveContainer width={"98%"} height={"98%"} minHeight={400}>*/}
//
// {/*    <BarChart*/}
// {/*        width={1920}*/}
// {/*        height={1920}*/}
// {/*        data={bar_data}*/}
// {/*        margin={{*/}
// {/*            top: 20,*/}
// {/*            right: 10,*/}
// {/*            left: 50,*/}
// {/*            bottom: 5,*/}
// {/*        }}*/}
// {/*        barGap={'5%'}*/}
// {/*        layout={'vertical'}*/}
// {/*        barSize={30}*/}
//
// {/*    >*/}
//
// {/*        <Brush dataKey="name" height={30} stroke="purple" startIndex={startIndex} endIndex={endIndex}*/}
// {/*               onChange={(evt) => handleChange(evt,bar_data.length, state)}*/}
// {/*        />*/}
// {/*        <CartesianGrid strokeDasharray="3 3" />*/}
// {/*        <XAxis type={'number'} hide domain={[(dataMin: number) => (0 - Math.abs(dataMin)), (dataMax: number) => (dataMax * 1.5)]}/>*/}
// {/*        <YAxis width={200} dx={-25} name={"test"} type={'category'} dataKey="bar_label" tickFormatter={tickFormatter}/>*/}
// {/*        <Tooltip content={<CustomTooltip />} />*/}
// {/*        <Legend />*/}
// {/*        <Bar name={"Batching"} dataKey="batching_wt" stackId="a" fill="#6C8EBF" >*/}
// {/*            <LabelList dataKey="batch_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
// {/*        </Bar>*/}
// {/*        <Bar name={"Prioritization"} dataKey="prioritization_wt" stackId="a" fill="#B8544F">*/}
// {/*            <LabelList dataKey="prio_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
// {/*        </Bar>*/}
// {/*        <Bar name={"Resource contention"} dataKey="contention_wt" stackId="a" fill="#D7B500">*/}
// {/*            <LabelList dataKey="cont_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
// {/*        </Bar>*/}
// {/*        <Bar name={"Resource unavailability"} dataKey="unavailability_wt" stackId="a" fill="#63B7B0" >*/}
// {/*            <LabelList dataKey="unav_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
// {/*        </Bar>*/}
// {/*        <Bar name={"Extraneous"} dataKey="extraneous_wt" stackId="a" fill="#B3B3B3">*/}
// {/*            <LabelList dataKey="extr_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
// {/*        </Bar>*/}
// {/*        /!*TODO Create second custom label that contains all the total values of the row. to replace BLACK colored label at end of bar*!/*/}
// {/*        <Bar name={"Total WT"} dataKey="" stackId="a" label={<CustEndLabel x={-10} y={-10} value={1}/>}/>*/}
// {/*    </BarChart>*/}
// {/*</ResponsiveContainer>*/}
//


import React from 'react';
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock"
import {secondsToDhm} from "../../../helpers/SecondsToDhm";
import {dhmToString} from "../../../helpers/dhmToString";

require("moment-duration-format");

stockInit(Highcharts)

const _colorDict = {
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
}
const COLORS = [_colorDict.batching, _colorDict.prioritization, _colorDict.contention, _colorDict.unavailability, _colorDict.extraneous]

type WTType = keyof typeof _colorDict;

interface Props {
    data: any;
    selectedWTType?: WTType;
}

function TransitionsBarChart({data, selectedWTType}: Props) {
    let dataArray = [];

    if (Array.isArray(data.data) && data.data.length > 0) {
        dataArray = data.data;
    } else if (data.data) {
        dataArray = [data.data];
    } else if (data && Array.isArray(data)) {
        dataArray = data;
    } else if (data && !Array.isArray(data)) {
        dataArray = [data];
    } else if (data === []) {
        return <div>No data present</div>;
    } else {
        return <div>No data available</div>;
    }

    const isActivityType = dataArray.length > 0 && dataArray[0].hasOwnProperty('source_activity');

    let processed_data = []
    let pre_categories = []
    let categories = [] as string[]
    if (isActivityType) {
        for (const dataKey in dataArray) {
            let out = {
                name: dataArray[dataKey].source_activity.trim().charAt(0).toUpperCase() + dataArray[dataKey].source_activity.trim().slice(1).toLowerCase() +
                    ' - ' + dataArray[dataKey].target_activity.trim().charAt(0).toUpperCase() + dataArray[dataKey].target_activity.trim().slice(1).toLowerCase(),
                total_wt: dataArray[dataKey].total_wt,
                batching_wt: dataArray[dataKey].batching_wt,
                prioritization_wt: dataArray[dataKey].prioritization_wt,
                contention_wt: dataArray[dataKey].contention_wt,
                unavailability_wt: dataArray[dataKey].unavailability_wt,
                extraneous_wt: dataArray[dataKey].extraneous_wt,

            }
            pre_categories.push(out)
        }
    } else {
        for (const dataKey in dataArray) {
            let source = dataArray[dataKey].source_resource;
            let target = dataArray[dataKey].target_resource;

            let formattedSource = (typeof source === 'string') ? source.trim().charAt(0).toUpperCase() + source.trim().slice(1).toLowerCase() : "Unknown";
            let formattedTarget = (typeof target === 'string') ? target.trim().charAt(0).toUpperCase() + target.trim().slice(1).toLowerCase() : "Unknown";
            let out = {
                name: formattedSource + ' - ' + formattedTarget,
                total_wt: dataArray[dataKey].total_wt,
                batching_wt: dataArray[dataKey].batching_wt,
                prioritization_wt: dataArray[dataKey].prioritization_wt,
                contention_wt: dataArray[dataKey].contention_wt,
                unavailability_wt: dataArray[dataKey].unavailability_wt,
                extraneous_wt: dataArray[dataKey].extraneous_wt,

            }
            pre_categories.push(out)
        }
    }

    let sorted_categories = pre_categories.sort(
        (p1, p2) => (p1.total_wt < p2.total_wt ? 1 : (p1.total_wt > p2.total_wt) ? -1 : 0)
    )
    for (const x in sorted_categories) {

        categories.push(sorted_categories[x].name)
    }

    type CauseData = {
        name: string;
        data: number[];
    };

    type AllData = {
        [cause in WTType]: CauseData;
    }

    let allData: AllData = {
        batching: {
            name: "Batching",
            data: [] as number[]
        },
        prioritization: {
            name: "Prioritization",
            data: [] as number[]
        },
        contention: {
            name: "Resource contention",
            data: [] as number[]
        },
        unavailability: {
            name: "Resource unavailability",
            data: [] as number[]
        },
        extraneous: {
            name: "Extraneous",
            data: [] as number[]
        }
    };

    for (const dataKey in sorted_categories) {
        allData.batching.data.push(Math.round(sorted_categories[dataKey].batching_wt));
        allData.prioritization.data.push(Math.round(sorted_categories[dataKey].prioritization_wt));
        allData.contention.data.push(Math.round(sorted_categories[dataKey].contention_wt));
        allData.unavailability.data.push(Math.round(sorted_categories[dataKey].unavailability_wt));
        allData.extraneous.data.push(Math.round(sorted_categories[dataKey].extraneous_wt));
    }

    if (selectedWTType) {
        let other = {
            name: "Other causes",
            data: [] as number[]
        };
        for (let i = 0; i < sorted_categories.length; i++) {
            other.data.push(0);
            for (const cause in allData) {
                if (cause !== selectedWTType) {
                    other.data[i] += allData[cause as WTType].data[i];
                }
            }
        }
        processed_data.push(allData[selectedWTType], other);
    } else {
        for (const cause in allData) {
            processed_data.push(allData[cause as WTType]);
        }
    }

    const baseHeight = 200;
    const additionalHeightPerCategory = 50;
    const maxHeight = 600;
    const dynamicHeight = Math.min(maxHeight, baseHeight + (categories.length * additionalHeightPerCategory));

    const options = {
        b_totals: [],
        colors: COLORS,
        chart: {
            type: 'bar',
            padding: [0, 0, 0, 0],
            margin: [60, 50, 125, 250],
            height: dynamicHeight,
            style: {
                fontFamily: 'Roboto',
                fontSize: 18
            }
        },
        title: {
            text: '',
        },
        xAxis: {
            type: 'category',
            categories: categories,
            min: 0,
            max: categories.length < 9 ? categories.length - 1 : 8,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            title: {
                text: 'Time',
                align: 'high'
            },
            labels: {
                align: 'right',
                formatter(this: any) {
                    const [y, d, h, m] = secondsToDhm(this.value);
                    return dhmToString([y, d, h, m]);
                }
            },
            stackLabels: {
                align: 'right',
                x: 20,
                enabled: true,
                formatter(this: any) {
                    const [y, d, h, m] = secondsToDhm(this.total);
                    return dhmToString([y, d, h, m]);
                }
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                pointWidth: 20,
                dataLabels: {
                    enabled: true,
                    align: 'left',
                    formatter(this: any) {
                        if (this.point.stackTotal === 0) return null;
                        const percentage = (this.y / this.point.stackTotal) * 100;
                        return `${Math.round(percentage)}%`;
                    },
                    style: {
                        fontSize: '10px',
                    }
                },
            },
        },
        legend: {
            enabled: true,
            reversed: false
        },
        tooltip: {
            formatter(this: Highcharts.TooltipFormatterContextObject) {
                const [y, d, h, m] = secondsToDhm(this.y as number);
                const timeString = dhmToString([y, d, h, m]);
                return `${this.series.name}: ${timeString}`;
            }
        },

        series: processed_data
    }

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </>
    )
}

export default TransitionsBarChart
