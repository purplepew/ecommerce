'use client'
import React from 'react';
import {
    Container,
    Box,
    Breadcrumbs,
    Typography,
    Link
} from '@mui/material';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';
import { HomeFilled } from '@mui/icons-material';

function page() {

    return (
        <Container sx={{ pt: '1rem' }}>
            <Breadcrumbs>
                <Link underline='hover' color='inherit' href='/' style={{ display: 'flex', alignItems: 'center' }}>
                    <HomeFilled fontSize="inherit" />
                    Home
                </Link>
                <Typography>Products</Typography>
            </Breadcrumbs>

            <Box sx={{ pt: '1rem', display: 'flex', gap: 5 }}>

                <Sidebar />

                <div>
                    <ProductList />
                </div>

            </Box>

        </Container>
    )
}

export default page