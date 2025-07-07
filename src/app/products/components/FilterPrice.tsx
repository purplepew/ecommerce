import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Button, Collapse, InputBase, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, ReactNode, SetStateAction, useCallback, useRef, useState } from "react";
import useUpdateParam from '../hooks/useUpdateParam'

export default function FilterPrice() {
    const updateParam = useUpdateParam()

    const [open, setOpen] = useState<boolean>(false)

    const [minPrice, setMinPrice] = useState<number>(0)
    const [maxPrice, setMaxPrice] = useState<number>(10000)

    const handleToggle = useCallback(() => setOpen(!open), [open])

    const handleChange = (setter: Dispatch<SetStateAction<number>>) => (e: ChangeEvent<HTMLInputElement>) => setter(Number(e.target.value))

    const handleMinPriceChange = () => {
        if (minPrice + 1 && minPrice < maxPrice) {
            updateParam('minValue', minPrice)
        }
    }

    const handleMaxPriceChange = () => {
        if (maxPrice && maxPrice > minPrice) {
            updateParam('maxValue', maxPrice)
        }
    }

    return (
        <>
            <ListItem>
                <ListItemButton onClick={handleToggle}>
                    <ListItemText secondary='Price' />
                    <ListItemIcon>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <Collapse in={open}>
                <Stack>
                    <TextField
                        value={minPrice}
                        onChange={handleChange(setMinPrice)}
                        label='Min'
                        type='number'
                        size="small"
                    />
                    <Button onClick={handleMinPriceChange} size='small'>set</Button>

                    <TextField
                        value={maxPrice}
                        onChange={handleChange(setMaxPrice)}
                        label='Max'
                        type='number'
                        size="small"
                    />
                    <Button onClick={handleMaxPriceChange} size='small'>set</Button>
                </Stack>
            </Collapse>
        </>
    )
}