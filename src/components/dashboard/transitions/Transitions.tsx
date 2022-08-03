import {Box, Card,} from "@mui/material";
import React from "react";
import TransitionsBarChart from "./TransitionsBarChart";
import TransitionsTable from "./TransitionsTable";

function Transitions(data:any) {
    return (
        <Box sx={{
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            mx: "5rem"
        }}>
            <Card sx={{ minWidth: 500 }}>
                <TransitionsBarChart data={data.data.report}/>
            </Card>
            <TransitionsTable data={data.data}/>
        </Box>
    )
}

export default Transitions