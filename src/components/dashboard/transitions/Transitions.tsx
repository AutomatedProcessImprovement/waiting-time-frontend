import {Box, Card,} from "@mui/material";
import React from "react";
import TransitionsBarChart from "./TransitionsBarChart";
import TransitionsTable from "./TransitionsTable";
import Typography from "@mui/material/Typography";

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
                <Typography align={"left"} variant="h5" component="div" sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                    Waiting time causes in activity transitions
                </Typography>
                <Typography  align={"left"} variant="h6" sx={{ fontSize: 16 }} color="text.secondary" component="div">
                    Total waiting time in activity transitions by its cause
                </Typography>
                <TransitionsBarChart data={data.data.report}/>
            </Card>
            <Card sx={{ minWidth: 500 }}>
                <TransitionsTable data={data.data}/>
            </Card>
        </Box>
    )
}

export default Transitions