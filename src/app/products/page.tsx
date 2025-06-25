'use client'
import React, { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Sidebar from './Sidebar'
import ProductList from './ProductList'

function page() {


    return (
        <Container sx={{ pt: '1rem' }}>
            <Breadcrumbs>
                <Link underline='hover' color='inherit' href='/'>Home</Link>
                <Typography>Products</Typography>
            </Breadcrumbs>

            <Box sx={{ pt: '1rem', display: 'flex', gap: '1rem'}}>

                <Sidebar />

                <ProductList />
            </Box>

        </Container>
    )
}

export default page