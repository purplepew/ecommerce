'use client'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import Link from 'next/link'
import ProfileAvatar from './ProfileAvatar'

export default function Header() {

    return (
        <AppBar position='static' color='transparent'>
            <Toolbar sx={{ gap: '2rem' }}>

                <IconButton color='primary' href='/'>
                    <LocalOfferIcon />
                    <Typography variant='h6'>Kuan</Typography>
                </IconButton>

                <Button href='/products' component={Link} size='small'>Products</Button>

                <Stack ml='auto' direction='row'>
                    <IconButton>
                        <FavoriteBorderIcon />
                    </IconButton>

                    <IconButton>
                        <ShoppingCartIcon />
                    </IconButton>

                    <ProfileAvatar />
                </Stack>

            </Toolbar>
        </AppBar>
    )
}