import {Box, Modal} from '@mui/material';
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
    values: object[];
    p_cte: number
}

export default function TableHeatmap(props: SimpleDialogProps) {
    const { onClose, open, values, p_cte } = props;
    let series = prepareHeatmapData(values)
    const p_cte_val = p_cte*100

    const handleClose = () => {
        onClose();
    };
    let height = 350
    if (series.length > 20) {
        height = 600
    }
    if (series.length > 50) {
        height = 800
    }
    if (series.length > 70) {
        height = 1200
    }

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 1550,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 12,
        p: 6,
    };

    const options : ApexOptions = {
        chart: {
            height: 1000,
            type: 'heatmap',
            zoom: {
                enabled: true
            }
        },
        series: prepareHeatmapData(values),
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: true,
                colorScale: {
                    ranges: [
                    {
                        from: 0.0,
                        to: p_cte_val-1,
                        name: 'Deterioration',
                        color: '#EF476F'
                    },
                    {
                        from: p_cte_val-(p_cte_val*0.001),
                        to: p_cte_val+(p_cte_val*0.001),
                        name: 'No Change',
                        color: '#FF8166'
                    },
                    {
                        from: p_cte_val+(p_cte_val*0.001),
                        to: p_cte_val+(p_cte_val*0.1),
                        name: 'Poor',
                        color: '#06D6A0'
                    },
                    {
                        from: p_cte_val+(p_cte_val*0.10),
                        to: p_cte_val+(p_cte_val*0.5),
                        name: 'Medium',
                        color: '#118AB2'
                    },
                    {
                        from: p_cte_val+(p_cte_val*0.5),
                        to: 100.0,
                        name: 'Good',
                        color: '#073B4C'
                    }
                    ]
                }
            }
        },
        dataLabels: {
            enabled: true
        },
        xaxis: {
            type: 'category',
            categories: ['Batching', 'R. Contention', 'Prioritization', 'R. Unavailability', 'Extraneous']
        }
        ,
        stroke: {
            width: 1
        },
        title: {
            text: 'CTE impact improvement heatmap | Current CTE: ' + (p_cte_val).toFixed(2) + '%'
        },
    };
    function prepareHeatmapData(data:any) {
        function convert(x:number[]){
            let res = []
            for (const xKey in x) {
                res.push(Number.parseFloat((x[xKey]*100).toFixed(2)))
            }
            return res
        }

        let _dataSeries = []
        for (const dataKey in data) {
            _dataSeries.push({
                name: data[dataKey].source_activity + " - " + data[dataKey].target_activity,
                data: Object.values(convert(data[dataKey].cte_impact)) as number[]
            })
        }

       return _dataSeries.reverse()
    }

    return (
        <Modal onClose={handleClose} open={open}>
            <Box sx={style}>
                <ReactApexChart
                    type={'heatmap'}
                    series={series}
                    options={options}
                    height={height}
                />
            </Box>
        </Modal>
    );

};