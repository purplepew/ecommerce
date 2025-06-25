import React from 'react'
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

function Sidebar() {
    const [openFreeShipping, setOpenFreeShipping] = useState(false)
    const [openRating, setOpenRating] = useState(false)
    const [openPrice, setOpenPrice] = useState(false)
    const [priceValue, setPriceValue] = useState<number[]>([100, 1000]);

    const handleChange = (event: Event, newValue: number[]) => {
        setPriceValue(newValue);
    }

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
                                <ExpandMoreIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openFreeShipping}>
                        <ListItem>
                            <FormControlLabel control={<Checkbox />} label='Free Shipping' />
                        </ListItem>
                    </Collapse>

                    <Divider />

                    <ListItem>
                        <ListItemButton onClick={() => setOpenRating(!openRating)}>
                            <ListItemText secondary='Rating' />
                            <ListItemIcon>
                                <ExpandMoreIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openRating}>
                        <ListItem>
                            <Rating />
                        </ListItem>
                    </Collapse>

                    <Divider />

                    <ListItem>
                        <ListItemButton onClick={() => setOpenPrice(!openPrice)}>
                            <ListItemText secondary='Price' />
                            <ListItemIcon>
                                <ExpandMoreIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={openPrice}>
                        <ListItem sx={{display: 'flex', flexDirection: 'column'}}>
                            <Slider
                                getAriaLabel={() => 'Price range'}
                                value={priceValue}
                                onChange={handleChange}
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