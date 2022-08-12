import {Box, Modal} from '@mui/material';
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
    values: object[]
}

export default function TableHeatmap(props: SimpleDialogProps) {
    const { onClose, open, values } = props;

    let series = prepareHeatmapData(values)

    const handleClose = () => {
        onClose();
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '40%',
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
            height: 350,
            type: 'heatmap',
            zoom: {
                enabled: false
            }
        },
        series: prepareHeatmapData(values),
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 0,
                useFillColorAsStroke: true,
                colorScale: {
                    ranges: [{
                        from: 0.00,
                        to: 0.45,
                        name: 'Very Poor',
                        color: '#B23A48'
                    },
                    {
                        from: 0.45,
                        to: 0.60,
                        name: 'Poor',
                        color: '#C44900'
                    },
                    {
                        from: 0.60,
                        to: 0.80,
                        name: 'Medium',
                        color: '#62A87C'
                    },
                    {
                        from: 0.80,
                        to: 1.00,
                        name: 'Good',
                        color: '#0B6E4F'
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
            text: 'CTE impact improvement heatmap'
        },
    };
    function prepareHeatmapData(data:any) {
        let dataseries = []
        for (const dataKey in data) {
            dataseries.push({
                name: data[dataKey].source_activity + " - " + data[dataKey].target_activity,
                data: Object.values(data[dataKey].cte_impact) as number[]
            })
        }

       return dataseries.reverse()
    }

    return (
        <Modal onClose={handleClose} open={open}>
            <Box sx={style}>
                <ReactApexChart
                    type={'heatmap'}
                    series={series}
                    options={options}
                    height={350}
                />
            </Box>
        </Modal>
    );

};