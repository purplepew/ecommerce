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
import { useAuth } from '../contexts/AuthContext';

function page() {

    const { user } = useAuth()

    if (!user) return <p>please login</p>

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