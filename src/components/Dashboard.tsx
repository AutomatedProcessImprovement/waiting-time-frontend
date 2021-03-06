import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Overview from "./dashboard/overview/Overview";
import Transitions from "./dashboard/transitions/Transitions";
import {alpha, Button, ButtonGroup, Grid, InputBase, styled, Tooltip, Typography} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Download from '@mui/icons-material/CloudDownloadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {useLocation} from "react-router-dom";
import Cteimpact from "./dashboard/cteimpact/Cteimpact";


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

const onDownload = (report:any, type:number) => {
    // TODO DEMO ONLY- REPLACE WITH LINK FROM SERVER
    console.log(report)
    console.log(type)
    const link = document.createElement("a");
    switch (type) {
        case 0:

            link.href = report.report_csv;
            link.setAttribute(
                'download',
                `report_csv.csv`
            )
            link.click();
            break
        case 1:
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report.result));
            link.href = dataStr;
            link.setAttribute(
                'download',
                `report_json.json`
            )
            link.click();
            break
        default:
            link.href = report.report_csv;
            link.setAttribute(
                'download',
                `report_csv.csv`
            )
            link.click();
            break
    }
};

interface LocationState {
    jsonLog : File
    report: any
    logName: string
}
const options = ['Download as CSV', 'Download as JSON'];

const BasicTabs = () => {
    const [value, setValue] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const {state} = useLocation()
    const {report} = state as LocationState
    const {logName} = state as LocationState

    let clean_data = report.result
    const data = JSON.parse(JSON.stringify(clean_data));

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
        onDownload(report, index)
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
                            <Tooltip title="Report Overview">
                                <Tab label="Overview" {...a11yProps(0)} />
                            </Tooltip>
                            <Tooltip title="Activity Transitions Report">
                                <Tab label="Transitions" {...a11yProps(1)} />
                            </Tooltip>
                            <Tooltip title="CTE Impact Report">
                                <Tab label="CTE Impact" {...a11yProps(2)} />
                            </Tooltip>
                        </Tabs>
                    </Grid>
                    <Grid item>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search???"
                                inputProps={{ 'aria-label': 'search' }}
                            />
                        </Search>

                    </Grid>
                    <Grid item>
                        <Tooltip title="Original Event Log Name">
                            <Typography>
                                <b>{logName}</b>
                            </Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                            <Tooltip title={'Download as CSV'}>
                                <Button size="small"
                                        aria-controls={open ? 'split-button-menu' : undefined}
                                        aria-expanded={open ? 'true' : undefined}
                                        aria-label="select merge strategy"
                                        aria-haspopup="menu"
                                        onClick={handleClick}>

                                    <Download />
                                </Button>
                            </Tooltip>
                            <Button
                                size="small"
                                aria-controls={open ? 'split-button-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-label="select merge strategy"
                                aria-haspopup="menu"
                                onClick={handleToggle}
                            >
                                <ArrowDropDownIcon />
                            </Button>
                        </ButtonGroup>
                        <Popper
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                    }}
                                >
                                    <Paper>
                                        <ClickAwayListener onClickAway={handleClose}>
                                            <MenuList id="split-button-menu" autoFocusItem>
                                                {options.map((option, index) => (
                                                    <MenuItem
                                                        key={option}
                                                        disabled={index === 2}
                                                        selected={index === selectedIndex}
                                                        onClick={(event) => handleMenuItemClick(event, index)}
                                                    >
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
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