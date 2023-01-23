import {
    Bar,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    ResponsiveContainer, Cell
} from "recharts";
import * as React from "react";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";

const _colorDict = {
    gray: "#666",
    batching: "#6C8EBF",
    prioritization: "#B8544F",
    contention: "#D7B500",
    unavailability: "#63B7B0",
    extraneous: "#B3B3B3",
}
const COLORS = [_colorDict.gray, _colorDict.batching,_colorDict.prioritization,_colorDict.contention, _colorDict.unavailability, _colorDict.extraneous]

const CustBarLabel = (props: { x: any; y:any, value: any; }) => {
    const { x, y, value } = props;
    return (
        <text x={x} y={y} dx={'20%'} dy={20} dominantBaseline="auto" textAnchor="end" fontWeight={"bolder"}>
            {(value*100).toFixed(2) + "%"}
        </text>
    );
};

// const getIntroOfPage = (label: string) => {
//     if (label === "Batching") {
//         return <><p>CTE after eliminating waiting</p><p>time due to batching</p></>
//     }
//     if (label === "Prioritization") {
//         return <><p>This bar represents the process CTE</p><p>value if all prioritization waiting time is eliminated.</p></>
//     }
//     if (label === "Resource Contention") {
//         return <><p>This bar represents the process CTE</p><p>value if all resource contention waiting time is eliminated.</p></>
//     }
//     if (label === "Resource Unavailability") {
//         return <><p>This bar represents the process CTE</p><p>value if all resource unavailability waiting time is eliminated.</p></>
//     }
//     if (label === "Extraneous") {
//         return <><p>This bar represents the process CTE</p><p>value if all extraneous waiting time is eliminated.</p></>
//     }
//     return "";
// };

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        if (payload[0].payload.name === "Current CTE") {
            return (
                <div className="tooltip">
                    <p className="label">{`Current CTE : ${(payload[0].value * 100).toFixed(4) + "%"} `} </p>
                </div>
            );
        } else {
            return (
                <div className="tooltip" style={{
                    paddingRight: 5
                }}>
                    <p className="label">{`CTE after eliminating ${label}`} </p> <p> {`waiting time: ${(payload[0].value*100).toFixed(4) + "%"} `} </p>
                </div>
            );
        }
    }
    return null;
};

export default function CTEBarChart(data:any) {
    console.log(data.data)
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

        series: [{
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

