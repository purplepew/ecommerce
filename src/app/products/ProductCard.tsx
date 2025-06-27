"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, Typography, Button, Box, IconButton, Rating } from "@mui/material"
import { FavoriteBorder, Favorite } from "@mui/icons-material"
import { useDispatch } from "react-redux"
import { getProductRatings } from "@/slices/productSlice"
import { AppDispatch } from "@/lib/store"

interface ProductCardProps {
    id: number
    name: string
    image: string
    price: number
    originalPrice?: number,
    loadingType: "eager" | "lazy",
    average?: number,
    count?: number
}

export default function ProductCard({
    id,
    name,
    image,
    price,
    originalPrice,
    loadingType = "lazy",
    average,
    count
}: ProductCardProps) {
    const dispatch: AppDispatch = useDispatch()
    const [isFavorite, setIsFavorite] = useState(false)
    const [ratings, setRatings] = useState(average ?? 0)
    const [ratingsCount, setRatingsCount] = useState(count ?? 0)

    useEffect(() => {
        dispatch(getProductRatings(id))
    }, [id])

    useEffect(()=>{
        if(!average || !count) return
        setRatings(average)
        setRatingsCount(count)
    }, [average, count])

    const hasDiscount = originalPrice && originalPrice > price

    return (
        <Card
            sx={{
                maxWidth: 280,
                height: 420,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: 2,
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                },
            }}
        >
            {/* Image Container */}
            <Box
                sx={{
                    position: "relative",
                    height: 240,
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 2,
                }}
            >
                {/* Favorite Button */}
                <IconButton
                    sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        backgroundColor: "white",
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,.3)',
                        }
                    }}
                    size="small"
                >
                    {isFavorite ? <Favorite sx={{ color: "#e91e63" }} /> : <FavoriteBorder />}
                </IconButton>

                {/* Product Image with Magnify Effect */}
                <Box sx={{ overflow: 'hidden' }}>
                    <Box
                        component="img"
                        // loading='eager'
                        src={image}
                        alt={name}
                        loading={loadingType}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transition: "transform 0.4s ease",
                            "&:hover": {
                                transform: "scale(1.4)",
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* Content */}
            <CardContent
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 2,
                    "&:last-child": { pb: 2 },
                }}
            >
                {/* Product Name */}
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#333",
                        mb: 2,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                    }}
                >
                    {name}
                </Typography>

                {/* Product Rating */}
                <Box>
                    <Rating value={ratings} />
                    {ratingsCount>0 && <Typography variant='body2'>{ratingsCount}</Typography>}
                </Box>


                {/* Pricing */}
                <Box sx={{ textAlign: "end", mb: 2 }}>
                    {hasDiscount && (
                        <Typography
                            variant="body2"
                            sx={{
                                textDecoration: "line-through",
                                color: "#999",
                                fontSize: "0.9rem",
                                mb: 0.5,
                            }}
                        >
                            €{originalPrice?.toFixed(2)}
                        </Typography>
                    )}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: hasDiscount ? "#e53e3e" : "#333",
                            fontSize: "1.1rem",
                        }}
                    >
                        €{price.toFixed(2)}
                    </Typography>
                </Box>

                {/* Add to Cart Button */}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        backgroundColor: "#4285f4",
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 1,
                        py: 1.2,
                        "&:hover": {
                            backgroundColor: "#3367d6",
                        },
                    }}
                >
                    Add to cart
                </Button>
            </CardContent>
        </Card>
    )
}
