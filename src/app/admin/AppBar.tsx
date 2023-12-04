import * as React from 'react';
import { AppBar, TitlePortal, Toolbar } from 'react-admin';
import { Box, useMediaQuery, Theme } from '@mui/material';

import Logo from './Logo';

const CustomAppBar = () => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar color="secondary" toolbar={<Toolbar />}>
            <TitlePortal />
            {isLargeEnough && <Logo />}
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
        </AppBar>
    );
};

export default CustomAppBar;