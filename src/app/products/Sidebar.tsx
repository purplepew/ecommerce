import React, { useEffect } from 'react'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Collapse from '@mui/material/Collapse'
import FormControlLabel from '@mui/material/FormControlLabel'
import Rating from '@mui/material/Rating'
import Slider from '@mui/material/Slider'
import Checkbox from '@mui/material/Checkbox'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useState } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

function Sidebar() {
    const [openFreeShipping, setOpenFreeShipping] = useState(false)
    const [openRating, setOpenRating] = useState(false)
    const [openPrice, setOpenPrice] = useState(false)

    const params = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    // Safely parse priceRange from URL
    const defaultPrice: number[] = [20, 100];
    let initialPrice = defaultPrice;
    try {
        const fromURL = JSON.parse(params.get('priceRange') || '');
        if (Array.isArray(fromURL) && fromURL.length === 2) initialPrice = fromURL;
    } catch { }

    const defaultRating: number | null = null
    let initalRating = defaultRating
    try {
        const fromURL = JSON.parse(params.get('ratingValue') || '')
        if(fromURL >= 0 && fromURL <= 5) initalRating = fromURL 
    } catch {}

    const defaultFreeShipping: boolean = false
    let initialFreeShipping = defaultFreeShipping
      try {
        const fromURL = JSON.parse(params.get('freeShipping') || '')
        if(typeof fromURL == 'boolean') initialFreeShipping = fromURL 
    } catch {}



    const [isFreeShipping, setIsFreeShipping] = useState<boolean>(initialFreeShipping)
    const [ratingValue, setRatingValue] = useState<number | null>(initalRating)
    const [priceValue, setPriceValue] = useState<number[]>(initialPrice);

    
    const handleIsFreeShipping = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setIsFreeShipping(checked)
        const newParams = new URLSearchParams(params)
        newParams.set('freeShipping', JSON.stringify(checked))
        router.replace(`${pathname}?${newParams.toString()}`, {scroll: false})
    }

    const handleRatingValueChange = (_: React.SyntheticEvent<Element, Event>, newValue: number | null) => {
        setRatingValue(newValue)
        const newParams = new URLSearchParams(params)
        newParams.set('ratingValue', JSON.stringify(newValue))
        router.replace(`${pathname}?${newParams.toString()}`, {scroll: false})
    }


    const handlePriceValueChange = (_: Event, newValue: number[]) => {
        setPriceValue(newValue)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            const newParams = new URLSearchParams(params)
            newParams.set('priceRange', JSON.stringify(priceValue))
            router.replace(`${pathname}?${newParams.toString()}`, { scroll: false })
        }, 500)

        return () => clearTimeout(timer)
    }, [priceValue, pathname, params, router])

    return (
        <>
            {/* Sidebar -- product filter */}
            <Box width={'15rem'}>
                <Typography variant='h4' fontWeight={'100'}>Filters</Typography>
                <List>

                    <ListItem>
                        <ListItemButton onClick={() => setOpenFreeShipping(!openFreeShipping)}>
                            <ListItemText secondary='Shipping free' />
                            <ListItemIcon>
                                {openFreeShipping ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openFreeShipping}>
                        <ListItem>
                            <FormControlLabel control={<Checkbox checked={isFreeShipping} onChange={handleIsFreeShipping} />} label='Free Shipping' />
                        </ListItem>
                    </Collapse>

                    <Divider />

                    <ListItem>
                        <ListItemButton onClick={() => setOpenRating(!openRating)}>
                            <ListItemText secondary='Rating' />
                            <ListItemIcon>
                                {openRating ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openRating}>
                        <ListItem>
                            <Rating
                                value={ratingValue}
                                onChange={handleRatingValueChange}
                            />
                        </ListItem>
                    </Collapse>

                    <Divider />

                    <ListItem>
                        <ListItemButton onClick={() => setOpenPrice(!openPrice)}>
                            <ListItemText secondary='Price' />
                            <ListItemIcon>
                                {openPrice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openPrice}>
                        <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Slider
                                getAriaLabel={() => 'Price range'}
                                value={priceValue}
                                onChange={handlePriceValueChange}
                                valueLabelDisplay="auto"
                                step={100}
                                max={3000}
                                min={20}
                            />
                            <ListItemText secondary='Set Min & Max' />
                        </ListItem>
                    </Collapse>

                </List>
            </Box>
        </>
    )
}

export default Sidebar