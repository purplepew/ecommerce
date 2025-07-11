'use client'
import React, { Suspense } from 'react';
import {
    Container,
    Box,
    Breadcrumbs,
    Typography,
    Link
} from '@mui/material';
import { HomeFilled } from '@mui/icons-material';
import Sidebar from './components/Sidebar';
import ProductList from './components/ProductList';
import DebugInfo from '../components/DebugInfo';

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

            <DebugInfo />

            <Box sx={{ pt: '1rem', display: 'flex', gap: 5 }}>

                <Suspense fallback={<div style={{width: '15rem'}}><Typography variant='h4' fontWeight={100}>Loading Filters...</Typography></div>}>
                  <Sidebar />
                </Suspense>

                <div>
                  <Suspense fallback={<div>Loading Products...</div>}>
                    <ProductList />
                  </Suspense>
                </div>

            </Box>

        </Container>
    )
}

export default page