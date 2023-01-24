import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
var moment = require("moment");
require("moment-duration-format");

export default function CTELineChart(data: any) {
    let chart_data = [...data.data]
    console.log(chart_data)

    let processed_data = []
    let wt_out = {
        name: 'Waiting time',
        data: [] as number[],
        color: '#fb5607'
    }
    let pt_out = {
        name: 'Processing time',
        data: [] as number[],
        color: '#0077b6'
    }
    for (const chartDataKey in chart_data) {
        wt_out.data.push(chart_data[chartDataKey].wt_total)
        pt_out.data.push(chart_data[chartDataKey].pt_total)
    }
    processed_data.push(wt_out, pt_out)
    console.log(processed_data)
    const options = {
        title: {
            text: 'Top 50 cases with the lowest CTE',
            align: 'left'
        },

        yAxis: {
            title: {
                text: 'Time'
            },
            labels: {
                formatter(this: any) {
                    // your code
                    return moment.duration(this.value, 'seconds').format('d[D] HH[H] mm[M]')
                }
            },
        },

        chart: {
            zoomType: 'x'
        },
        xAxis: {
            title : {
                text: 'Case ID'
            },
            tickInterval: 1
        },
        tooltip: {
            formatter(this: Highcharts.TooltipFormatterContextObject) {
                return this.series.name + ": " +moment.duration(this.y, 'seconds').format('d[D] HH[H] mm[M]')
            }
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            step: 1
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 0
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
            {/*<ResponsiveContainer width={"100%"} height={400} min-width={400}>*/}
            {/*    <LineChart width={730} height={250} data={chart_data}*/}
            {/*               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>*/}
            {/*        <CartesianGrid strokeDasharray="3 3" />*/}
            {/*        <Brush dataKey="name" height={30} stroke="#8884d8"/>*/}
            {/*        <XAxis dataKey="case_id" padding={{ left: 30, right: 30 }}>*/}
            {/*            <Label*/}
            {/*                style={{*/}
            {/*                    textAnchor: "middle",*/}
            {/*                    fontSize: "110%",*/}
            {/*                    fill: "black",*/}
            {/*                }}*/}
            {/*                dy={27}*/}
            {/*                dx={0}*/}
            {/*                value={"Case ID"} />*/}
            {/*        </XAxis>*/}
            {/*        <YAxis type={"number"} domain={['dataMin', 'dataMax']} tickFormatter={YAxisFormatter} tickCount={8}>*/}
            {/*            <Label*/}
            {/*                style={{*/}
            {/*                    textAnchor: "middle",*/}
            {/*                    fontSize: "110%",*/}
            {/*                    fill: "black",*/}
            {/*                    fontWeight:'bold'*/}
            {/*                }}*/}
            {/*                dy={20}*/}
            {/*                dx={-40}*/}
            {/*                angle={270}*/}
            {/*                value={"Time"} />*/}
            {/*        </YAxis>*/}
            {/*        <Tooltip content={CustomTooltip}/>*/}
            {/*        <Legend />*/}
            {/*        <Line type="monotone" dataKey="pt_total" stroke="#fb5607" strokeWidth={'2px'} name={'Processing time'}/>*/}
            {/*        <Line type="monotone" dataKey="wt_total" stroke="#0077b6" strokeWidth={'2px'} name={'Waiting time'}/>*/}
            {/*    </LineChart>*/}
            {/*</ResponsiveContainer>*/}
        </>
    )
};