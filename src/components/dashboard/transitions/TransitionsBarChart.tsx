import React from 'react';
import HighchartsReact from "highcharts-react-official";
import * as Highcharts from "highcharts";
import stockInit from "highcharts/modules/stock"
var moment = require("moment");
require("moment-duration-format");

stockInit(Highcharts)

function TransitionsBarChart(data: any) {

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
                text: 'Time',
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
                    enabled: false,
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
                return this.series.name + ": " +moment.duration(this.y, 'seconds').format('d[D] HH[H] mm[M]')
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
