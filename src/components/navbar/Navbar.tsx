import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
interface MenuOptions {
    title: string,
    to: string
}

const menuOptions: Array<MenuOptions> =
    [
        { title: "Find a result", to: "/search" },
        { title: "Upload event log", to: "/upload" }
    ]

function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        component={Link}
                        to={'/upload'}
                    >
                        <QueryStatsIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Waiting Time Analyser
                    </Typography>
                    {menuOptions.map(({ title, to }, index) => (
                        <Button
                            key={`menu_item_btn_${index}`}
                            component={Link}
                            to={to}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {title} |
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default NavBar