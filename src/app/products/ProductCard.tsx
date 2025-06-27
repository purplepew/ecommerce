"use client"

import { memo, useEffect, useState } from "react"
import { Card, CardContent, Typography, Button, Box, IconButton, Rating } from "@mui/material"
import { FavoriteBorder, Favorite } from "@mui/icons-material"
import { useQuery } from "urql"
import { GET_PRODUCT_RATINGS } from "@/graphql/query"
import { useSearchParams } from "next/navigation"

interface ProductCardProps {
    id: number
    name: string
    image: string | undefined
    price: number
    originalPrice?: number,
    loadingType: "eager" | "lazy",
}

function ProductCard({
    id,
    name,
    image,
    price,
    originalPrice,
    loadingType = "lazy",
}: ProductCardProps) {
    const params = useSearchParams()
    const ratingValueParam = params.get('ratingValue')
    const ratingValue = ratingValueParam ? (JSON.parse(ratingValueParam) as null | number) : null
    
    const [isFavorite, setIsFavorite] = useState(false)
    const [ratings, setRatings] = useState(0)
    const [ratingsCount, setRatingsCount] = useState(0)
    
    const [result] = useQuery({
        query: GET_PRODUCT_RATINGS,
        variables: { productId: id },
        pause: !id,
    })

    useEffect(() => {
        if (result.data && result.data.getProductRatings) {
            setRatings(result.data.getProductRatings.average);
            setRatingsCount(result.data.getProductRatings.count);
        }
    }, [result.data]);

    console.log("RESULTS: ", result)

    const hasDiscount = originalPrice && originalPrice > price
    
    if (ratingValue && ratingValue !== Number(ratings?.toFixed())) {
        return null;
    }
    
    return (
        <Card
            sx={{
                width: 280,
                maxWidth: 280,
                minWidth: 280,
                height: 420,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                borderRadius: 2,
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
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
                <Box sx={{ overflow: 'hidden', height: 200, width: '100%' }}>
                    <Box
                        component="img"
                        // loading='eager'
                        src={image ?? ""}
                        alt={name}
                        loading={loadingType}
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            backgroundPosition: 'fit',
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
                    <Rating value={ratings} readOnly />
                    {ratingsCount > 0 && <Typography variant='body2'>{ratingsCount}</Typography>}
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

const memoized = memo(ProductCard)
export default memoized