import * as React from 'react';
import {
    DataGrid,
    GridColDef,
    GridEventListener,
    GridToolbarColumnsButton,
    GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton
} from '@mui/x-data-grid';
import RowDialog from '../RowDialog';
import {Button} from "@mui/material";
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableHeatmap from "./heatmap/TableHeatmap";


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', hide:true, flex:0.01},
    { field: 'source_activity', headerName: 'Source Activity', flex:0.05},
    { field: 'target_activity', headerName: 'Target activity', flex:0.05},
    {
        field: 'case_freq',
        headerName: 'Case Frequency',
        type: 'number',
        flex:0.02,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2) ) + "%"
    },
    {
        field: 'total_freq',
        headerName: 'Total Frequency',
        type: 'number',
        flex:0.02
    },
    {
        field: 'cte_impact_total',
        headerName: 'Total Waiting Time',
        flex:0.02,
        type: 'number',
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },
    {
        field: 'batching_impact',
        headerName: 'Batching',
        flex:0.02,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.batching_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },
    {
        field: 'prioritization_impact',
        headerName: 'Prioritization',
        flex:0.02,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.prioritization_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"

    },
    {
        field: 'contention_impact',
        headerName: 'Resource Contention',
        flex:0.02,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.contention_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },
    {
        field: 'unavailability_impact',
        headerName: 'Resource Unavailability',
        flex:0.02,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.unavailability_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },
    {
        field: 'extraneous_impact',
        headerName: 'Total Extraneous',
        flex:0.02,
        type: 'number',
        valueGetter: params =>
            params.row.cte_impact.extraneous_impact,
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2)) + "%"
    },

];

const add_index = (data:any) => {
    for (let i = 0; i < data.length; i++) {
        data[i].id = i+1
    }
    return data
}

export default function CTETable(data:any) {
    let table_data = add_index(data.data.report)
    let [open, setOpen] = React.useState(false);
    let [heatmapOpen, setHeatmapOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState<string[]>([]);
    const [selectedTitle, setSelectedTitle] = React.useState<string>("");


    const handleClose = () => {
        setOpen(false);
    };

    const handleHeatmapClose = () => {
        setHeatmapOpen(false);
    };

    const onEvent: GridEventListener<'rowDoubleClick'> = (
        params, // GridRowParams
    ) => {
        setOpen(true)
        setSelectedValue(params.row.wt_by_resource as string[])
        setSelectedTitle(params.row.source_activity + " - " + params.row.target_activity )
    }
    const handleClick = () => {
        setHeatmapOpen(true)
    }

    const GridToolbarHeatmap = () => {
        return (
            <Button
                startIcon={<ViewModuleIcon />}
                onClick={handleClick}
                size={'small'}
            >
                Show Heatmap
            </Button>
        )
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarHeatmap/>
            </GridToolbarContainer>
        );
    }
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={table_data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                components={{ Toolbar: CustomToolbar }}
                onRowDoubleClick={onEvent}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'cte_impact_total', sort: 'desc' }],
                    },
                }}
                componentsProps={{
                    panel: {
                        sx: {

                            '& .MuiTypography-root': {
                                color: 'dodgerblue',
                                fontSize: 15,
                            },
                            '& .MuiButton-root': {
                                fontSize: 15
                            }
                        },
                    },
                }}
            />
            <RowDialog
                open={open}
                onClose={handleClose}
                selectedValue={add_index(selectedValue)}
                selectedTitle={selectedTitle}
                type={1}/>
            <TableHeatmap
             onClose={handleHeatmapClose} open={heatmapOpen} values={table_data} p_cte={data.data.process_cte} />
        </div>
    );
}