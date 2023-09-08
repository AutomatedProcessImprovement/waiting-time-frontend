import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Button,
    ButtonGroup,
    Grid,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Tabs,
    Tab,
    Tooltip,
    Typography,
    ClickAwayListener,
    Grow,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Download from '@mui/icons-material/CloudDownloadOutlined';

import Overview from './dashboard/overview/Overview';


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

const onDownload = (report:any, type:number) => {
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

const options = ['Download as CSV', 'Download as JSON'];

const BasicTabs = () => {
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const { state } = useLocation();
    const { jobId } = state as { jobId: string };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleClick = () => {
        // onDownload(report, 0)
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
        // onDownload(report, index)
    };

    return (
        <Box sx={{ width: '100%', mt: 1, zIndex: 100000 }}>
            <Box>
                <Grid
                    container
                    spacing={3}
                    alignItems={"stretch"}
                    justifyContent="space-around"
                    direction="row"
                >
                    <Grid item>
                        <Typography variant={"h4"}>
                            Dashboard
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tabs value={value} onChange={handleChange} aria-label=" ">
                            <Tab label="Overview" {...a11yProps(0)} />
                            <Tab label="Batching" {...a11yProps(1)} />
                            <Tab label="Prioritization" {...a11yProps(2)} />
                            <Tab label="Resource Contention" {...a11yProps(3)} />
                            <Tab label="Resource Unavailability" {...a11yProps(4)} />
                            <Tab label="Extraneous Factors" {...a11yProps(5)} />
                        </Tabs>
                    </Grid>
                    <Grid item>
                        {/*<Search>*/}
                        {/*    <SearchIconWrapper>*/}
                        {/*        <SearchIcon />*/}
                        {/*    </SearchIconWrapper>*/}
                        {/*    <StyledInputBase*/}
                        {/*        placeholder="Search…"*/}
                        {/*        inputProps={{ 'aria-label': 'search' }}*/}
                        {/*    />*/}
                        {/*</Search>*/}

                    </Grid>
                    <Grid item>
                        <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button" sx={{zIndex: 100000}}>
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
                            disablePortal={false}
                            sx={{zIndex: 100000}}
                            style={{zIndex: 100000}}
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                            placement === 'bottom' ? 'center top' : 'center bottom',
                                        zIndex: 100000
                                    }}

                                >
                                    <Paper sx={{zIndex: 100000}}>
                                        <ClickAwayListener onClickAway={handleClose} sx={{zIndex: 100000}}>
                                            <MenuList id="split-button-menu" autoFocusItem sx={{zIndex: 100000}}>
                                                {options.map((option, index) => (
                                                    <MenuItem
                                                        key={option}
                                                        disabled={index === 2}
                                                        selected={index === selectedIndex}
                                                        onClick={(event) => handleMenuItemClick(event, index)}
                                                        sx={{zIndex: 100000}}
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
                <Overview jobId={jobId} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                {/* Add your Batching component here */}
            </TabPanel>
            <TabPanel value={value} index={2}>
                {/* Add your Prioritization component here */}
            </TabPanel>
            <TabPanel value={value} index={3}>
                {/* Add your Resource Contention component here */}
            </TabPanel>
            <TabPanel value={value} index={4}>
                {/* Add your Resource Unavailability component here */}
            </TabPanel>
            <TabPanel value={value} index={5}>
                {/* Add your Extraneous Factors component here */}
            </TabPanel>
        </Box>
    );
}


export default BasicTabs