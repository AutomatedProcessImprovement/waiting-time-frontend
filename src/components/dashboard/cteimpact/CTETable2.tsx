import * as React from 'react';
import {
    DataGrid,
    GridColDef,
    GridToolbarColumnsButton,
    GridToolbarContainer, GridToolbarDensitySelector, GridToolbarFilterButton
} from '@mui/x-data-grid';
import { Typography} from "@mui/material";
var moment = require("moment");
require("moment-duration-format");

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID',flex: 0.01, hide:true},
    { field: 'case_id',  headerAlign: 'center', align: 'center', headerName: 'Case ID', flex: 0.01,},
    {
        field: 'cte_impact',
        headerName: 'Case CTE',
        type: 'number',
        flex: 0.01,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: params =>
            ((params?.value * 100).toFixed(2) ) + "%"
    },
    {
        field: 'pt_total',
        headerName: 'Processing time',
        type: 'number',
        flex: 0.01,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },
    {
        field: 'wt_total',
        headerName: 'Waiting time',
        type: 'number',
        flex: 0.01,
        align: 'center',
        headerAlign: 'center',
        valueFormatter: params =>
            moment.duration(params?.value, 'seconds').format('d[D] HH[H] mm[M]')
    },

];

const add_index = (data:any) => {
    for (let i = 0; i < data.length; i++) {
        data[i].id = i+1
    }
    return data
}

export default function CTETable2(data:any) {
    let table_data = add_index(data.data)

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
            </GridToolbarContainer>
        );
    }
    return (
        <>
            <Typography variant="h5" component="div" sx={{ fontSize: 18 }}>
                Top 50 cases with the lowest CTE
            </Typography>
            <DataGrid
                autoHeight={true}
                rows={table_data}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                components={{ Toolbar: CustomToolbar }}
                initialState={{
                    sorting: {
                        sortModel: [{ field: 'cte_impact', sort: 'asc' }],
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
        </>
    );
}