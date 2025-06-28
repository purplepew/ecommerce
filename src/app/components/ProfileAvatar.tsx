import { Button, Avatar, Typography, IconButton, Menu, List, ListItemButton, ListItemText, ListItemIcon, ListItem } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Logout } from '@mui/icons-material'

function ProfileAvatar() {
    const router = useRouter()
    const { user, refresh } = useAuth()
    const [signInLink, setSignInLink] = useState<null | string>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return

        const storedLink = localStorage.getItem('googleSignInLink')
        if (storedLink) {
            setSignInLink(storedLink)
            return
        }

        const fetchSignInlink = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/google/generateAuthUrl`)
                const { url } = await response.json()
                setSignInLink(url)
                localStorage.setItem('googleSignInLink', url)
            } catch (error) {

            }
        }

        fetchSignInlink()
    }, [])

    const navigateToGoogleAuth = async () => {
        if (signInLink) {
            router.push(signInLink)
        }
    }

    const handleLogout = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, { method: 'POST' })
            await refresh()
        } catch (error) {
            console.log(error)
        }
    }

    if (!user) {
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
                    </List>
                </Menu>
            </>
        )
    }
}

export default ProfileAvatar