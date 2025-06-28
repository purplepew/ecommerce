'use client'
import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import Sidebar from './Sidebar'
import ProductList from './ProductList'
import { useAuth } from '../contexts/AuthContext'

function page() {

    const {user} = useAuth()

    if(!user) return <p>please login</p>

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