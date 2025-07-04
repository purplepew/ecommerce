"use client"
import { memo, useState } from "react"
import { Card, CardContent, Typography, Button, Box, IconButton, Rating, CardMedia, Stack, CardActionArea } from "@mui/material"
import { FavoriteBorder, Favorite } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ProductCardProps {
    id: number
    name: string
    image: string | undefined
    price: number
    originalPrice?: number,
    loadingType?: 'eager' | 'lazy',
    ratingsAverage: number | null,
    ratingsCount: number
}

function ProductCard({
    id,
    name,
    image,
    price,
    originalPrice,
    loadingType,
    ratingsAverage,
    ratingsCount
}: ProductCardProps) {
    const router = useRouter()
    const [isFavorite, setIsFavorite] = useState(false)

    const hasDiscount = originalPrice && originalPrice > price

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
                    <Rating defaultValue={ratingsAverage ?? 0} readOnly size="small" />
                    {ratingsCount > 0 && <Typography variant='body2'>{ratingsCount}</Typography>}
                </Stack>

                {/* Add to Cart Button */}
                <Button
                    variant="outlined"
                    fullWidth
                    sx={{
                        "&:hover": {
                            backgroundColor: "#9f9f9f",
                        },
                    }}
                >
                    Add to cart
                </Button>

                {/* Favorite Button */}
                <IconButton
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 30,
                        zIndex: 2,
                        backgroundColor: "rgba(225,225,225,.3)",
                        '&:hover': {
                            backgroundColor: 'rgba(0,0,0,.3)',
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