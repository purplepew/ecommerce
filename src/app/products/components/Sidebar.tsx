import { useMemo } from 'react'
import { Divider, Box, Typography, List } from '@mui/material'
import { useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import FilterRatings from './FilterRatings'
import useUpdateParam from '../hooks/useUpdateParam'
import FilterPrice from './FilterPrice'
import FilterShipping from './FilterShipping'

const DEFAULTS = {
    price: [100, 10000] as [number, number],
    rating: null as number | null,
    freeShipping: false as boolean,
    priceOrder: undefined as 'asc' | 'desc' | undefined
}

function parseParam<T>(param: string | null, fallback: T): T {
    try {
        const parsed = JSON.parse(param ?? '')
        if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length === fallback.length) return parsed as T
        if (typeof fallback === typeof parsed) return parsed
    } catch { }
    return fallback
}

function Sidebar() {
    const [open, setOpen] = useState({ freeShipping: false, rating: false, price: false })

    const params = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const updateParam = useUpdateParam()

    // Memoize initial values to avoid recalculation on every render
    const initialValues = useMemo(() => ({
        price: parseParam<[number, number]>(params.get('priceRange'), DEFAULTS.price),
        rating: parseParam<number | null>(params.get('ratingValue'), DEFAULTS.rating),
        freeShipping: parseParam<boolean>(params.get('freeShipping'), DEFAULTS.freeShipping),
    }), [params])

    const handleToggle = (key: keyof typeof open) => setOpen(o => ({ ...o, [key]: !o[key] }))

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
