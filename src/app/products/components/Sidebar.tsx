import React, { useEffect, useMemo, useCallback, useRef } from 'react'
import {
    Divider, Box, Typography, List, ListItem, ListItemButton,
    ListItemText, ListItemIcon, Collapse, FormControlLabel,
    Rating, Checkbox, Button, InputBase
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import FilterRatings from './FilterRatings'
import useUpdateParam from '../hooks/useUpdateParam'
import FilterPrice from './FilterPrice'

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

    const [isFreeShipping, setIsFreeShipping] = useState<boolean | null>(initialValues.freeShipping)
    const [ratingValue, setRatingValue] = useState<number | null>(initialValues.rating)
  
    const handleIsFreeShipping = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setIsFreeShipping(checked)
        updateParam('freeShipping', checked)
    }

    const handleRatingValueChange = (_: React.SyntheticEvent, newValue: number | null) => {
        setRatingValue(newValue)
        updateParam('ratingValue', newValue)
    }

    const handleToggle = (key: keyof typeof open) => setOpen(o => ({ ...o, [key]: !o[key] }))

    return (
        <Box width={'15rem'}>
            <Typography variant='h4' fontWeight={100}>Filters</Typography>
            <List>
                {/* Free Shipping */}
                <ListItem>
                    <ListItemButton onClick={() => handleToggle('freeShipping')}>
                        <ListItemText secondary='Shipping free' />
                        <ListItemIcon>
                            {open.freeShipping ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.freeShipping}>
                    <ListItem>
                        <FormControlLabel
                            control={<Checkbox checked={isFreeShipping ?? false} onChange={handleIsFreeShipping} />}
                            label='Free Shipping'
                        />
                    </ListItem>
                </Collapse>
                <Divider />

                {/* Rating */}
                <FilterRatings />
                <Divider />

                {/* Price */}
                <FilterPrice />
            </List>
        </Box>
    )
}

export default Sidebar
