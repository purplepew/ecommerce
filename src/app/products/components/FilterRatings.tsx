import { Button, Collapse, FormControlLabel, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Rating, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import useUpdateParam from '../hooks/useUpdateParam'

export default function FilterRatings() {
    const updateParam = useUpdateParam()

    const [open, setOpen] = useState<boolean>(false)

    const handleToggle = useCallback(() => setOpen(!open), [open])

    const handleRatingValueChange = (_: React.SyntheticEvent, newValue: number | null) => {
        updateParam('ratingValue', newValue)
    }

    const RatingComponent = ({ value, label }: { value: number, label: string }) => (
                <IconButton onClick={(e) => handleRatingValueChange(e, value)} disableTouchRipple
                    sx={{display: 'flex', flexDirection: 'column'}}
                >
                    <Rating size="small" readOnly defaultValue={value} />
                    <Typography variant="caption">{label}</Typography>
                </IconButton>
    )

    return (
        <>
            <ListItem>
                <ListItemButton onClick={handleToggle}>
                    <ListItemText secondary='Rating' />
                    <ListItemIcon>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>
            <Collapse in={open}>
                <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
                    <RatingComponent value={5} label=""/>
                    <RatingComponent value={4} label="4 star and up"/>
                    <RatingComponent value={3} label="3 star and up"/>
                    <RatingComponent value={2} label="2 star and up"/>
                    <RatingComponent value={1} label="1 star and up"/>
                </ListItem>
                <ListItem>
                    <Button size='small' onClick={() => handleRatingValueChange({} as React.SyntheticEvent, null)}>
                        Reset
                    </Button>
                </ListItem>
            </Collapse >
        </>
    )
}