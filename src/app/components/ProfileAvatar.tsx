import { Button, Avatar, Typography, IconButton, Menu, List, ListItemButton, ListItemText, ListItemIcon, ListItem, Skeleton } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Logout, NoteAdd } from '@mui/icons-material'
import { useGetCartQuery } from '@/slices/cartApiSlice'

function ProfileAvatar() {
    const router = useRouter()

    const { user, refresh, loading, setCart } = useAuth()

    const { data: cart } = useGetCartQuery({ userId: user?.id as number }, { skip: !Boolean(user?.id) })

    useEffect(() => {
        if(cart){
            setCart(cart)
        }
    }, [cart])

    const [signInLink, setSignInLink] = useState<null | string>(null)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = useCallback(() => {
        setAnchorEl(null)
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const storedLink = localStorage.getItem('googleSignInLink')
        if (storedLink) {
            setSignInLink(storedLink)
            return
        }

        const fetchSignInlink = async () => {
            try {
                const response = await fetch('api/google/generateAuthUrl')
                const { url } = await response.json()
                setSignInLink(url)
                localStorage.setItem('googleSignInLink', url)
            } catch (error) {

            }
        }

        fetchSignInlink()
    }, [])

    const navigateToGoogleAuth = useCallback(async () => {
        if (signInLink) {
            router.push(signInLink)
        }
    }, [signInLink])

    const handleLogout = useCallback(async () => {
        try {
            await fetch('api/logout', { method: 'POST' })
            await refresh()
        } catch (error) {
            console.log(error)
        }
    }, [])

    if (loading) {
        return <Skeleton height={50} width={100} />
    } else if (!user) {
        return (
            <>
                {signInLink && <Button onClick={navigateToGoogleAuth} color='primary'>Sign in</Button>}
            </>
        )
    } else {
        return (
            <>
                <IconButton onClick={handleOpen}>
                    <Avatar src={user.pfp} />
                </IconButton>
                <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
                    <List>
                        <ListItem>
                            <Typography variant='caption'>{user?.name}</Typography>
                        </ListItem>
                        <ListItemButton dense onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout color='error' />
                            </ListItemIcon>
                            <ListItemText primary='Logout' />
                        </ListItemButton>
                        <ListItemButton dense onClick={() => router.push('/products/new')}>
                            <ListItemIcon>
                                <NoteAdd color='error' />
                            </ListItemIcon>
                            <ListItemText primary='Create products' />
                        </ListItemButton>
                        <ListItemButton dense onClick={() => router.push('/products/manage')}>
                            <ListItemIcon>
                                <NoteAdd color='error' />
                            </ListItemIcon>
                            <ListItemText primary='Manage products' />
                        </ListItemButton>
                    </List>
                </Menu>
            </>
        )
    }
}

export default ProfileAvatar