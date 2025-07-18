"use client"
import { memo, useEffect, useState } from "react"
import { Card, CardContent, Typography, Button, Box, IconButton, Rating, CardMedia, Stack, CardActionArea, Badge } from "@mui/material"
import { FavoriteBorder, Favorite } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useGetProductRatingsQuery } from "@/slices/productsApiSlice"
import { useAddToCartMutation } from "@/slices/cartApiSlice"
import useAuth from "@/app/hooks/useAuth"

interface ProductCardProps {
    id: number
    name: string
    image: string | undefined
    price: number
    originalPrice?: number,
    loadingType?: 'eager' | 'lazy',
    urlRatingValue: number | null
}

function ProductCard({
    id,
    name,
    image,
    price,
    originalPrice,
    loadingType,
    urlRatingValue
}: ProductCardProps) {
    const router = useRouter()
    const [isFavorite, setIsFavorite] = useState(false)
    const [isInTheCart, setIsInTheCart] = useState(false)
    const [ratingsAverage, setRatingsAverage] = useState<null | number>(null)
    const [ratingsCount, setRatingsCount] = useState(0)

    const hasDiscount = originalPrice && originalPrice > price

    const { data, isError, error } = useGetProductRatingsQuery({ productId: id })

    isError && console.log('ERROR: ', error)

    useEffect(()=>{
        if(data){
            setRatingsAverage(data.average)
            setRatingsCount(data.count)
        }
    }, [data])

    const user = useAuth()

    const [addToCart] = useAddToCartMutation()

    const handleAddToCart = async () => {
        if (!user?.cart) return
        try {
            await addToCart({ productId: id, cartId: user?.cart.id, price: price, quantity: 1 }).unwrap()
            setIsInTheCart(true)
        } catch (error) {
            console.log(error)
        }
    }

    const getBadgeContent = () => {
        if (!isInTheCart) return null

        const item = user?.cart?.cartItems.find(cart => cart.products.id === id)
        return item?.quantity || null
    }

    if (urlRatingValue && data) {
        if (data.average < urlRatingValue) {
            return null
        }
    }

    if (!image) return null

    return (
        <Card
            sx={{
                width: 280,
                maxWidth: 280,
                minWidth: 280,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                borderRadius: 2,
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
                }
            }}
        >
            <CardActionArea onClick={() => router.push(`/products/detail/${id}`)}>

                {/* Image Container */}
                <Box
                    sx={{
                        position: "relative",
                        height: 200,
                        overflow: "hidden",
                        backgroundColor: "#f8f9fa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        src={image}
                        alt={name}
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={35}
                        loading={loadingType}
                        sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 
         33vw"
                    />
                </Box>
            </CardActionArea>

            {/* Content */}
            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    position: 'relative',
                    justifyContent: 'space-between'
                }}
            >
                {/* Product Name */}
                <Typography
                    variant="body1"
                    sx={{
                        fontWeight: 600,
                        color: "#333",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        display: 'inline'
                    }}
                    title={name}
                >
                    {name.length >= 34 ? name.slice(0, 28) + '...' : name}
                </Typography>

                {/* Pricing */}
                <Box>
                    {hasDiscount && (
                        <Typography
                            variant="caption"
                            sx={{
                                textDecoration: "line-through",
                                color: "#999",
                            }}
                        >
                            €{originalPrice?.toFixed(2)}
                        </Typography>
                    )}
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: 700,
                            color: hasDiscount ? "firebrick" : "#333",
                        }}
                    >
                        €{price.toFixed(2)}
                    </Typography>
                </Box>

                {/* Product Rating */}
                <Stack direction='row'>
                    <Rating value={ratingsAverage ?? 0} readOnly size="small" />
                    {ratingsCount > 0 && <Typography variant='body2'>{ratingsCount}</Typography>}
                </Stack>

                {/* Add to Cart Button */}
                <Badge color='primary' badgeContent={getBadgeContent()}>
                    <Button
                        onClick={handleAddToCart}
                        variant="outlined"
                        fullWidth
                        {...(isInTheCart && { color: 'primary', variant: 'contained' })}
                        sx={{
                            "&:hover": {
                                backgroundColor: "#9f9f9f",
                            },
                        }}
                    >
                        {isInTheCart ? "Add to cart" : "Add to cart"}
                    </Button>
                </Badge>

                {/* Favorite Button */}
                <IconButton
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 30,
                        zIndex: 2,
                        backgroundColor: "rgba(225,225,225,.3)",
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,.2)',
                            color: 'black'
                        }
                    }}
                    size="small"
                >
                    {isFavorite ? <Favorite sx={{ color: "#e91e63" }} /> : <FavoriteBorder />}
                </IconButton>
            </CardContent>
        </Card>
    )
}

const memoized = memo(ProductCard)
export default memoized