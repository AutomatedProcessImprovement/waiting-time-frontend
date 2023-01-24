import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const _colorDict = {
    gray: "#666",
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
}
const COLORS = [_colorDict.gray, _colorDict.batching,_colorDict.prioritization,_colorDict.contention, _colorDict.unavailability, _colorDict.extraneous]

export default function CTEBarChart(data:any) {
    let processed_data = [] as number[]
    for (const dataKey in data.data) {
        processed_data.push(data.data[dataKey].y)
    }
    const options = {
        colors: COLORS,
        chart: {
            type: 'bar',
            padding: [0, 0, 0, 0],
            margin: [60, 50, 125, 50],
            height: 550
        },
        title: {
            text: 'Potential CTE improvement per waiting time cause',
            align: 'left'
        },
        subtitle: {
            text: 'Potential CTE values if waiting times of a particular cause are eliminated',
            align: 'left'
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            title: {
                text: '% improvement',
                align: 'high'
            },
            labels: {
                formatter(this: any) {
                    // your code
                    return (this.value*100).toFixed(2) + "%"
                }
            },
        },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: true,
                    formatter(this: any) {
                        // your code
                        return (this.y*100).toFixed(2) + "%"
                    }
                }
            }

        },
        tooltip: {
            formatter(this: Highcharts.TooltipFormatterContextObject) {

                // @ts-ignore
                return "CTE after eliminating waiting time due to " + this.series.name + ": " + (this.y*100).toFixed(2) + "%"
            }
        },

        series: [
            {
                name: "Current CTE",
                data: [data.data[0].y],
            },
            {
                name: "Batching",
                data: [data.data[1].y]
            },
            {
                name: "Prioritization",
                data: [data.data[2].y]
            },
            {
                name: "Resource contention",
                data: [data.data[3].y]
            },
            {
                name: "Resource unavailability",
                data: [data.data[4].y]
            },
            {
                name: "Extraneous",
                data: [data.data[5].y]
            }
        ]
    }

    return (
        <>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
            {/*<ResponsiveContainer width={"100%"} height={400} min-width={400}>*/}
            {/*<BarChart*/}
            {/*    width={1000}*/}
            {/*    height={300}*/}
            {/*    data={data.data}*/}
            {/*    margin={{*/}
            {/*        top: 20,*/}
            {/*        right: 30,*/}
            {/*        left: 20,*/}
            {/*        bottom: 5,*/}
            {/*    }}*/}
            {/*    barGap={'5%'}*/}
            {/*    layout={'vertical'}*/}
            {/*    barSize={30}*/}
            {/*>*/}
            {/*    <CartesianGrid strokeDasharray="3 3" />*/}
            {/*    <XAxis type={'number'} domain={[0,1]} hide/>*/}
            {/*    <YAxis width={200} dx={-25} name={"test"} type={'category'} dataKey="name" />*/}
            {/*    <Tooltip content={<CustomTooltip />} />*/}
            {/*    <Bar dataKey="value" label={CustBarLabel}>*/}
            {/*        {data.data.map((entry: any, index: any) => (*/}
            {/*            <Cell key={`cell-${index}`} fill={COLORS[index % 20]} />*/}
            {/*        ))}*/}
            {/*    </Bar>*/}
            {/*</BarChart>*/}
            {/*</ResponsiveContainer>*/}
        </>
    )
}

