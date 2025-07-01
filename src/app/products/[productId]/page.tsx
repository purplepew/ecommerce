'use client'
import { useParams } from 'next/navigation';
import { Box, Typography, Button, TextField } from "@mui/material"
import { ShoppingCart } from '@mui/icons-material';
import { memo, useEffect, useState } from 'react';
import Image from 'next/image';
import { useGetAllProductsQuery } from '@/slices/productsApiSlice';

function route() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | undefined>()

  
  const { data, isLoading, isSuccess, isError } = useGetAllProductsQuery({}, {
    selectFromResult: ({ data, isLoading, isSuccess, isError }) => ({ data, isLoading, isSuccess, isError })
  })

  useEffect(()=>{
    if(data && isSuccess){
      const origImageLink = data.entities[Number(productId)].image!
      const highResSrc = `/_next/image?url=${encodeURIComponent(origImageLink)}&w=1200&q=80`
      const image = new window.Image()
      image.src = highResSrc
      image.onload = () => {
        setImageSrc(highResSrc)
      }
    }
  },[data, isSuccess])
  
  if (data && isSuccess) {
    const product = data.entities[Number(productId)]
    const name = product.name
    const image = product.image!
    const price = product.price
    const id = product.id
    const freeShipping = product.freeShipping

    return (
      <Box sx={{ display: "flex", gap: 4, maxWidth: 900, mx: "auto", pt: 5 }}>
        {/* Product Image */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
            height: 500,
            width: 500,
            position: 'relative'
          }}
        >
          <img
            src={imageSrc ?? `/_next/image?url=${encodeURIComponent(image)}&w=1080&q=1`}
            alt={name}
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Box>

        {/* Product Details */}
        <Box sx={{ flex: 1, py: 2 }}>
          {/* Price */}
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: "#333" }}>
            €{price.toFixed(2)}
          </Typography>

          <Typography variant="body2" sx={{ color: "#4285f4", mb: 3 }}>
            Prices incl. VAT plus shipping costs
          </Typography>

          {/* Availability
          <Typography variant="body1" sx={{ mb: 4, color: "#333" }}>
            {availability}, delivery time {deliveryTime}
          </Typography> */}

          {/* Quantity */}
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 500, color: "#333" }}>
            Qty
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 4, alignItems: "center" }}>
            <TextField
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
              inputProps={{ min: 1 }}
              sx={{
                width: 80,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
              size="small"
            />

            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={() => { }}
              sx={{
                backgroundColor: "#00bcd4",
                "&:hover": { backgroundColor: "#00acc1" },
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1,
              }}
            >
              Add to cart
            </Button>
          </Box>

          {/* Product Number */}
          <Typography variant="caption">
            Product number: {id}
          </Typography>
          <Typography>
            Loremi fasolatido Loremi fasolatido Loremi fasolatido Loremi fasolatido Loremi fasolatido Loremi fasolatido
          </Typography>
        </Box>
      </Box>
    )
  } else if (isLoading) {
    return <p>Loading...</p>
  }else if(isError){
    return <p>Error!</p>
  }
  

}

const memoized = memo(route)
export default memoized