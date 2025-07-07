import { ExpandLess, ExpandMore } from "@mui/icons-material";
import useGetParams from "../hooks/useGetParams"
import useUpdateParam from "../hooks/useUpdateParam"
import { Checkbox, Collapse, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Rating, Stack, Typography } from "@mui/material";
import {  useState } from "react";


export default function FilterShipping() {
    const updateParam = useUpdateParam()
    const getParam = useGetParams()
    const param = getParam('freeShipping')

    const [open, setOpen] = useState(false)
    
    const [isChecked, setIsChecked] = useState(JSON.parse(param as string) ?? false)

    const handleChange = () => {
        setIsChecked(!isChecked) 
        updateParam({ freeShipping: !isChecked ? !isChecked : null }) // we are still using the stale isChecked so we are reversing it
    }

    return (
        <>
            <ListItem>
                <ListItemButton onClick={() => setOpen(!open)}>
                    <ListItemText secondary='Shipping free' />
                    <ListItemIcon>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <Collapse in={open}>
                <ListItem>
                    <FormControlLabel
                        control={<Checkbox checked={isChecked} onChange={handleChange} />}
                        label='Free Shipping'
                    />
                </ListItem>
            </Collapse>
        </>
    )
}