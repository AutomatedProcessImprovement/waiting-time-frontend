import React, {useState} from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList, Brush
} from 'recharts';
import cloneDeep from 'lodash.clonedeep';
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock"
import {Card} from "@mui/material";
var moment = require("moment");
require("moment-duration-format");

stockInit(Highcharts)
const CustEndLabel = (props: { x: any; y: any; value: number;}) => {
    const { x, y, value } = props;

    if (value < 1) {
        return (
            <text
                x={x}
                y={y}
                dx={"1%"}
                dy={20}
                fontSize="15"
                fontWeight="bold"
                fill={"#181818"}
                textAnchor="start"
            >
                No Waiting Time
            </text>
        );
    }
    return (
        <text
            x={x}
            y={y}
            dx={"50px"}
            dy={20}
            fontSize="15"
            fontWeight="bold"
            fill={"#181818"}
            textAnchor="start"
        >
            {moment.duration(value, 'seconds').format('d[D] HH[H] mm[M]')}
        </text>
    );
}

const CustBarLabel = (props: { x: any; y:any, value: any; }) => {
    const { x, y, value } = props;
    if (value === "0.00" || isNaN(value)) {
        return (
            <text>
            </text>
        );
    }
    return (
        <text x={x} y={y} dx={'5px'} dy={20} dominantBaseline="auto" textAnchor="start">
            {value + "%"}
        </text>
    );
};

function AdditionalData(data: any) {
//    Calculate the percentage of respective waiting_times in each report entry
//     let data = _data.data
    for (var entry of data) {
        // console.log(entry)
        entry.batching_wt_perc = (entry.batching_wt / entry.total_wt * 100).toFixed(2)
        entry.prioritization_wt_perc = (entry.prioritization_wt / entry.total_wt * 100).toFixed(2)
        entry.contention_wt_perc = (entry.contention_wt / entry.total_wt * 100).toFixed(2)
        entry.unavailability_wt_perc = (entry.unavailability_wt / entry.total_wt * 100).toFixed(2)
        entry.extraneous_wt_perc = (entry.extraneous_wt / entry.total_wt * 100).toFixed(2)
        entry.bar_label = entry.source_activity + " - " + entry.target_activity
    }
    return data.sort((f: { total_wt: number; }, s: { total_wt: number; }) => 0 - (f.total_wt > s.total_wt ? 1 : -1))
}
const CustomTooltip = ({ active, payload, label }: any) => {

    if (active && payload && payload.length) {
        return (
            <div className="tooltip">
                <div className="label">{`Waiting times between activities: ${label}`}</div>
                {payload.map((entry: any) => {
                    let s
                    switch(entry.dataKey){
                        case "batching_wt":
                            s= <div style={{margin:0, padding:0}}>{entry.name} : <b>{moment.duration(entry.value, 'seconds').format('d[D] HH[H] mm[M]')}</b> | <b>{entry.payload.batching_wt_perc +"%"}</b></div>
                            break
                        case "prioritization_wt":
                            s= <div style={{margin:0, padding:0}}>{entry.name} : <b>{moment.duration(entry.value, 'seconds').format('d[D] HH[H] mm[M]')}</b> | <b>{entry.payload.prioritization_wt_perc+"%"}</b></div>
                            break
                        case "contention_wt":
                            s= <div style={{margin:0, padding:0}}>{entry.name} : <b>{moment.duration(entry.value, 'seconds').format('d[D] HH[H] mm[M]')}</b> | <b>{entry.payload.contention_wt_perc+"%"}</b></div>
                            break
                        case "unavailability_wt":
                            s= <div style={{margin:0, padding:0}}>{entry.name} : <b>{moment.duration(entry.value, 'seconds').format('d[D] HH[H] mm[M]')}</b> | <b>{entry.payload.unavailability_wt_perc+"%"}</b></div>
                            break
                        case "extraneous_wt":
                            s= <div style={{margin:0, padding:0}}>{entry.name} : <b>{moment.duration(entry.value, 'seconds').format('d[D] HH[H] mm[M]')}</b> | <b>{entry.payload.extraneous_wt_perc+"%"}</b></div>
                            break
                    }
                    return s
                    })}
            </div>
        );
    }

    return null;
};


const customFormatter = (valueToFormat: any): string => {
    console.log(valueToFormat)
    return `${ moment.duration(valueToFormat, 'seconds').format('d[D] HH[H] mm[M]')}`;
}

function TransitionsBarChart(data: any) {
    const data_copy = cloneDeep(data.data);
    const bar_data = AdditionalData(data_copy)
    console.log()
    let tickFormatter = (value: string, index: number) => {
        const limit = 20; // put your maximum character
        if (value.length < limit) return value;
        return `${value.substring(0, limit)}...`;
    };
    const [state, setState] = useState({ startIndex: 0, endIndex: 10 });
    const { startIndex, endIndex } = state;

    function handleChange(evt: Object, max_len: number, state: any) {
        if (Object.values(evt)[0] <= 0 || Object.values(evt)[1]-10 <= 0) {
            setState({
                ...state,
                startIndex: 0,
                endIndex: 10
            });
            return
        }
        if (Object.values(evt)[0] + 10 >= max_len || Object.values(evt)[1] >= max_len) {
            setState({
                ...state,
                startIndex: max_len -11,
                endIndex: max_len -1
            });
            return
        }
        if (Object.values(evt)[0] + 10 !== Object.values(evt)[1]) {
            setState({
                ...state,
                startIndex: Object.values(evt)[0],
                endIndex: Object.values(evt)[0] + 10
            });
            return
        }
    }

    const _colorDict = {
        batching: "#6C8EBF",
        prioritization: "#B8544F",
        contention: "#D7B500",
        unavailability: "#63B7B0",
        extraneous: "#B3B3B3",
    }
    const COLORS = [_colorDict.batching, _colorDict.prioritization, _colorDict.contention, _colorDict.unavailability, _colorDict.extraneous]

    let processed_data = []
    let pre_categories = []
    let categories = [] as string[]
    for (const dataKey in data.data) {
        let out = {
            name: data.data[dataKey].source_activity + ' - ' + data.data[dataKey].target_activity,
            total_wt: data.data[dataKey].total_wt,
            batching_wt :data.data[dataKey].batching_wt,
            prioritization_wt :data.data[dataKey].prioritization_wt,
            contention_wt :data.data[dataKey].contention_wt,
            unavailability_wt :data.data[dataKey].unavailability_wt,
            extraneous_wt :data.data[dataKey].extraneous_wt,

        }
        pre_categories.push(out)
    }

    let sorted_categories = pre_categories.sort(
        (p1,p2) => (p1.total_wt < p2.total_wt ? 1 : (p1.total_wt > p2.total_wt) ? -1: 0)
    )
    for (const x in sorted_categories) {

        categories.push(sorted_categories[x].name)
    }

    let batching = {
        name: "Batching",
        data: [] as number[]
    }
    let prio = {
            name: "Prioritization",
            data: [] as number[]
    }
    let conten = {
            name: "Resource contention",
            data: [] as number[]
    }
    let unav = {
            name: "Resource unavailability",
            data: [] as number[]
    }
    let extra = {
            name: "Extraneous",
            data: [] as number[]
    }

    for (const dataKey in sorted_categories) {
        batching.data.push(Math.round(sorted_categories[dataKey].batching_wt))
        prio.data.push(Math.round(sorted_categories[dataKey].prioritization_wt))
        conten.data.push(Math.round(sorted_categories[dataKey].contention_wt))
        unav.data.push(Math.round(sorted_categories[dataKey].unavailability_wt))
        extra.data.push(Math.round(sorted_categories[dataKey].extraneous_wt))
    }
    processed_data.push(batching,prio,conten,unav,extra)

    console.log(processed_data)
    const options = {
        b_totals: [],
        colors: COLORS.reverse(),
        chart: {
            type: 'bar',
            padding: [0, 0, 0, 0],
            margin: [60, 50, 125, 250],
            height: 550
        },
        title: {
            text: 'Waiting time causes in activity transitions',
            align: 'left'
        },
        subtitle: {
            text: 'Total waiting time in activity transitions by its cause',
            align: 'left'
        },
        xAxis: {
            type: 'category',
            categories: categories,
            min: 0,
            max: 8,
            scrollbar: {
                enabled: true
            },
            tickLength: 0
        },
        yAxis: {
            title: {
                text: 'Votes',
                align: 'high'
            },
            labels: {
                formatter(this: any) {
                    // your code
                    return moment.duration(this.value, 'seconds').format('d[D] HH[H] mm[M]')
                }
            },
            stackLabels: {
                enabled: true,
                formatter(this: any) {
                    // your code
                    return moment.duration(this.total, 'seconds').format('d[D] HH[H] mm[M]')
                }
            }
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    formatter(this: any) {
                        // your code
                        return moment.duration(this.y, 'seconds').format('d[D] HH[H] mm[M]')
                    }
                }
            },
        },
        legend: {
            enabled: true,
            reversed: true
        },
        tooltip: {
            formatter(this: Highcharts.TooltipFormatterContextObject) {
                // your code
                return moment.duration(this.y, 'seconds').format('d[D] HH[H] mm[M]')
            }
        },

        series: processed_data.reverse()
    }
    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />

            {/*<ResponsiveContainer width={"98%"} height={"98%"} minHeight={400}>*/}

            {/*    <BarChart*/}
            {/*        width={1920}*/}
            {/*        height={1920}*/}
            {/*        data={bar_data}*/}
            {/*        margin={{*/}
            {/*            top: 20,*/}
            {/*            right: 10,*/}
            {/*            left: 50,*/}
            {/*            bottom: 5,*/}
            {/*        }}*/}
            {/*        barGap={'5%'}*/}
            {/*        layout={'vertical'}*/}
            {/*        barSize={30}*/}

            {/*    >*/}

            {/*        <Brush dataKey="name" height={30} stroke="purple" startIndex={startIndex} endIndex={endIndex}*/}
            {/*               onChange={(evt) => handleChange(evt,bar_data.length, state)}*/}
            {/*        />*/}
            {/*        <CartesianGrid strokeDasharray="3 3" />*/}
            {/*        <XAxis type={'number'} hide domain={[(dataMin: number) => (0 - Math.abs(dataMin)), (dataMax: number) => (dataMax * 1.5)]}/>*/}
            {/*        <YAxis width={200} dx={-25} name={"test"} type={'category'} dataKey="bar_label" tickFormatter={tickFormatter}/>*/}
            {/*        <Tooltip content={<CustomTooltip />} />*/}
            {/*        <Legend />*/}
            {/*        <Bar name={"Batching"} dataKey="batching_wt" stackId="a" fill="#6C8EBF" >*/}
            {/*            <LabelList dataKey="batch_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
            {/*        </Bar>*/}
            {/*        <Bar name={"Prioritization"} dataKey="prioritization_wt" stackId="a" fill="#B8544F">*/}
            {/*            <LabelList dataKey="prio_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
            {/*        </Bar>*/}
            {/*        <Bar name={"Resource contention"} dataKey="contention_wt" stackId="a" fill="#D7B500">*/}
            {/*            <LabelList dataKey="cont_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
            {/*        </Bar>*/}
            {/*        <Bar name={"Resource unavailability"} dataKey="unavailability_wt" stackId="a" fill="#63B7B0" >*/}
            {/*            <LabelList dataKey="unav_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
            {/*        </Bar>*/}
            {/*        <Bar name={"Extraneous"} dataKey="extraneous_wt" stackId="a" fill="#B3B3B3">*/}
            {/*            <LabelList dataKey="extr_wt_perc" content={<CustBarLabel x={0} y={0} value={1}/>}/>*/}
            {/*        </Bar>*/}
            {/*        /!*TODO Create second custom label that contains all the total values of the row. to replace BLACK colored label at end of bar*!/*/}
            {/*        <Bar name={"Total WT"} dataKey="" stackId="a" label={<CustEndLabel x={-10} y={-10} value={1}/>}/>*/}
            {/*    </BarChart>*/}
            {/*</ResponsiveContainer>*/}
        </>
    )
}
export default TransitionsBarChart
