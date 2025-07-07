'use client'
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Button, Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, TextField } from "@mui/material";
import { FormEvent, useCallback, useState } from "react";
import useUpdateParam from '../hooks/useUpdateParam'
import useGetParams from "../hooks/useGetParams";

export default function FilterPrice() {
    const getParam = useGetParams()
    const updateParam = useUpdateParam()

    const [open, setOpen] = useState<boolean>(false)

    const handleToggle = useCallback(() => setOpen(!open), [open])

    const handleFilterPrice = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const minRaw = formData.get('Min')
        const maxRaw = formData.get('Max')

        const minValue = minRaw !== null && minRaw !== '' ? Number(minRaw) : 0
        const maxValue = maxRaw !== null && maxRaw !== '' ? Number(maxRaw) : 10000

        updateParam({
            minValue: minValue,
            maxValue: maxValue
        })
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
                <form onSubmit={handleFilterPrice}>
                    <Stack gap={2} width={100}>
                        <TextField
                            size="small"
                            type='number'
                            label='Min'
                            name='Min'
                            defaultValue={getParam('minValue')}
                        />
                        <TextField
                            size="small"
                            type='number'
                            label='Max'
                            name='Max'
                            defaultValue={getParam('maxValue') ?? 10000}
                        />
                        <Button type='submit' size='small' variant='outlined'>set</Button>
                    </Stack>
                </form>
            </Collapse>
        </>
    )
}