'use client'
import React from 'react';
import {
    Container,
    Box,
    Breadcrumbs,
    Typography,
    Link
} from '@mui/material';
import Sidebar from './Sidebar';
import ProductList from './ProductList';

function page() {

    return (
        <Container sx={{ pt: '1rem' }}>
            <Breadcrumbs>
                <Link underline='hover' color='inherit' href='/'>Home</Link>
                <Typography>Products</Typography>
            </Breadcrumbs>

            <Box sx={{ pt: '1rem', display: 'flex', gap: '1rem' }}>

                <Sidebar />

                <ProductList />
            </Box>

        </Container>
    )
}

export default page