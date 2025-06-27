import React, { useEffect, useMemo, useCallback } from 'react'
import {
    Divider, Box, Typography, List, ListItem, ListItemButton,
    ListItemText, ListItemIcon, Collapse, FormControlLabel,
    Rating, Slider, Radio, RadioGroup, Checkbox, Button
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

const DEFAULTS = {
    price: [100, 10000] as [number, number],
    rating: null as number | null,
    freeShipping: false,
    priceOrder: 1 as 1 | 2 | 3,
}

function parseParam<T>(param: string | null, fallback: T): T {
    try {
        const parsed = JSON.parse(param ?? '')
        if (Array.isArray(fallback) && Array.isArray(parsed) && parsed.length === fallback.length) return parsed as T
        if (typeof fallback === typeof parsed) return parsed
    } catch {}
    return fallback
}

function Sidebar() {
    const [open, setOpen] = useState({ freeShipping: false, rating: false, price: false })

    const params = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    // Memoize initial values to avoid recalculation on every render
    const initialValues = useMemo(() => ({
        price: parseParam<[number, number]>(params.get('priceRange'), DEFAULTS.price),
        rating: parseParam<number | null>(params.get('ratingValue'), DEFAULTS.rating),
        freeShipping: parseParam<boolean>(params.get('freeShipping'), DEFAULTS.freeShipping),
        priceOrder: parseParam<1 | 2 | 3>(params.get('priceOrder'), DEFAULTS.priceOrder),
    }), [params])

    const [isFreeShipping, setIsFreeShipping] = useState<boolean | null>(initialValues.freeShipping)
    const [ratingValue, setRatingValue] = useState<number | null>(initialValues.rating)
    const [priceValue, setPriceValue] = useState<[number, number]>(initialValues.price)
    const [priceOrder, setPriceOrder] = useState<1 | 2 | 3>(initialValues.priceOrder)

    // Helper to update URL params
    const updateParams = useCallback((key: string, value: any) => {
        const newParams = new URLSearchParams(params)
        newParams.set(key, JSON.stringify(value))
        router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
    }, [params, pathname, router])

    const handleIsFreeShipping = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean | null) => {
        setIsFreeShipping(checked)
        updateParams('freeShipping', checked)
    }

    const handleRatingValueChange = (_: React.SyntheticEvent, newValue: number | null) => {
        setRatingValue(newValue)
        updateParams('ratingValue', newValue)
    }

    const handlePriceValueChange = (_: Event, newValue: number | number[]) => {
        setPriceValue(newValue as [number, number])
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            updateParams('priceRange', priceValue)
        }, 500)
        return () => clearTimeout(timer)
    }, [priceValue, updateParams])

    const handlePriceOrderChange = (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
        const numValue = Number(value) as 1 | 2 | 3
        setPriceOrder(numValue)
        updateParams('priceOrder', numValue)
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
                    <ListItem>
                        <Button size='small' onClick={() => handleIsFreeShipping({} as React.ChangeEvent<HTMLInputElement>, null)}>
                            Reset
                        </Button>
                    </ListItem>
                </Collapse>
                <Divider />

                {/* Rating */}
                <ListItem>
                    <ListItemButton onClick={() => handleToggle('rating')}>
                        <ListItemText secondary='Rating' />
                        <ListItemIcon>
                            {open.rating ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.rating}>
                    <ListItem>
                        <Rating value={ratingValue} onChange={handleRatingValueChange} />
                    </ListItem>
                    <ListItem>
                        <Button size='small' onClick={() => handleRatingValueChange({} as React.SyntheticEvent, null)}>
                            Reset
                        </Button>
                    </ListItem>
                </Collapse>
                <Divider />

                {/* Price */}
                <ListItem>
                    <ListItemButton onClick={() => handleToggle('price')}>
                        <ListItemText secondary='Price' />
                        <ListItemIcon>
                            {open.price ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                <Collapse in={open.price}>
                    <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Slider
                            getAriaLabel={() => 'Price range'}
                            value={priceValue}
                            onChange={handlePriceValueChange}
                            valueLabelDisplay="auto"
                            step={100}
                            max={10000}
                            min={20}
                        />
                        <ListItemText secondary='Set Min & Max' />
                        <RadioGroup name='priceOrder' value={priceOrder} onChange={handlePriceOrderChange}>
                            <FormControlLabel value={1} control={<Radio />} label='No particular order' />
                            <FormControlLabel value={2} control={<Radio />} label='Lowest To Highest' />
                            <FormControlLabel value={3} control={<Radio />} label='Highest To Lowest' />
                        </RadioGroup>
                    </ListItem>
                </Collapse>
            </List>
        </Box>
    )
}

export default Sidebar
