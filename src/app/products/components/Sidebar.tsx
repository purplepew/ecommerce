'use client'
import { useMemo } from 'react'
import { Divider, Box, Typography, List, Skeleton } from '@mui/material'
import { useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import useUpdateParam from '../hooks/useUpdateParam'
import dynamic from 'next/dynamic'

const FilterRatings = dynamic(() => import('./FilterRatings'), {
    loading: () => <Skeleton height={50} width={150} />,
    ssr: false
})
const FilterPrice = dynamic(() => import('./FilterPrice'), {
    loading: () => <Skeleton height={50} width={150} />,
    ssr: false
})
const FilterShipping = dynamic(() => import('./FilterShipping'), {
    loading: () => <Skeleton height={50} width={150} />,
    ssr: false
})

function Sidebar() {
    return (
        <Box width={'15rem'}>
            <Typography variant='h4' fontWeight={100}>Filters</Typography>
            <List>
                <FilterShipping />

                <Divider />

                <FilterRatings />

                <Divider />

                <FilterPrice />
            </List>
        </Box>
    )
}

export default Sidebar
