import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Overview from "./dashboard/Overview";
import Transitions from "./dashboard/Transitions";

// import data from '../demo_data/batching_output_example.json'
import {alpha, Grid, IconButton, InputBase, styled, Typography} from "@mui/material";

import Download from '@mui/icons-material/CloudDownloadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {useLocation} from "react-router-dom";
import Cteimpact from "./dashboard/Cteimpact";


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const onDownload = (report:string) => {
    // TODO DEMO ONLY- REPLACE WITH LINK FROM SERVER
    console.log(report)
    const link = document.createElement("a");
    link.href = report;
    link.setAttribute(
        'download',
        `report_csv.csv`
    )
    link.click();
};

interface LocationState {
    jsonLog : File
    report: any
    logName: string
}

const BasicTabs = () => {
    const [value, setValue] = React.useState(0);

    const {state} = useLocation()
    const {report} = state as LocationState
    const {logName} = state as LocationState

    let data = report.result
    console.log(report.report_csv)
    console.log(logName)

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box>
                <Grid
                    container
                    spacing={3}
                    alignItems={"stretch"}
                    justifyContent="space-between"
                    direction="row"
                >
                    <Grid item>
                        <Typography variant={"h4"}>
                            Dashboard
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
                            <Tab label="Overview" {...a11yProps(0)} />
                            <Tab label="Transitions" {...a11yProps(1)} />
                            <Tab label="CTE Impact" {...a11yProps(2)} />
                        </Tabs>
                    </Grid>
                    <Grid item>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>

                    </Grid>
                    <Grid item>
                        <Typography>
                            Log: {logName}
                        </Typography>
                    </Grid>
                    <Grid item>

                        <IconButton aria-label="download" size="large" onClick={() => onDownload(report.report_csv)}>
                            <Download />
                        </IconButton>
                    </Grid>
                </Grid>

            </Box>
            <TabPanel value={value} index={0}>
                <Overview data={data} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Transitions data={data} sx={{ mx: "2rem" }}/>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Cteimpact data={data}/>
            </TabPanel>
        </Box>
    );
}


export default BasicTabs