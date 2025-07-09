import { ShoppingCart } from '@mui/icons-material'
import { Avatar, Badge, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Menu } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'
import { MouseEvent, useEffect, useState } from 'react'
import Image from 'next/image'

export default function Cart() {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const [badgeContent, setBadgeContent] = useState<number | null>(null)
    const open = Boolean(anchorEl)

    const handleOpen = (e: MouseEvent<HTMLElement>) => {
        setAnchorEl(e.currentTarget)
        setBadgeContent(null)
    }
    const handleClose = () => setAnchorEl(null)

    const { user, loading } = useAuth()

    useEffect(() => {
        if (user?.cart) {
            setBadgeContent(user?.cart.cartItems.length)
        }
    }, [user?.cart])

    if (user?.cart) {
        return (
            <>
                <IconButton onClick={handleOpen}>
                    <Badge badgeContent={badgeContent} color='primary'>
                        <ShoppingCart />
                    </Badge>
                </IconButton>
                <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                    <List>
                        {user.cart.cartItems.map((item, index) => {
                            const name = item.products.name
                            const slicedName = name.length > 30 ? name.substring(0, 30) + '...' : name
                            const price = item.products.price
                            const quantity = item.quantity

                            return (
                                <ListItemButton key={index}>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Image src={item.products.image!} alt={name} fill quality={1} sizes='40px' />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={slicedName} secondary={`$${price} (qty: ${quantity})`} />
                                </ListItemButton>
                            )
                        })}
                    </List>
                </Menu>
            </>
        )
    }
    return (
        <IconButton>
            <ShoppingCart />
        </IconButton>
    )
}