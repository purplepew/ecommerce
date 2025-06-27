import { Product, selectAllProducts } from '@/slices/productSlice'
import React, { useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import { useSearchParams } from 'next/navigation'

function ProductList() {
    const products = useSelector(selectAllProducts) as Product[]
    const params = useSearchParams()

    const priceRangeParam = params.get('priceRange')
    const priceOrderParam = params.get('priceOrder')
    const ratingValueParam = params.get('ratingValue')
    const freeShippingParam = params.get('freeShipping')
    const priceRange = priceRangeParam ? (JSON.parse(priceRangeParam) as number[]) : null
    const priceOrder = priceOrderParam ? (JSON.parse(priceOrderParam) as 1 | 2 | 3) : null
    const ratingValue = ratingValueParam ? (JSON.parse(ratingValueParam) as null | number) : null
    const freeShipping = freeShippingParam ? (JSON.parse(freeShippingParam) as boolean) : null

    const sortedProducts = useMemo(() => {
        return priceOrder == 1 || priceOrder == null
            ? products
            : products.slice().sort((a, b) => priceOrder == 2 ? a.price - b.price : b.price - a.price)
    }, [priceOrder, products])

    const filteredProducts = sortedProducts.filter(product => {
        const productRating = product.ratingAverage
        const productFreeShipping = product.freeShipping

        if (typeof freeShipping === 'boolean') {
            if (freeShipping && !productFreeShipping) {
            return false
            }
            if (!freeShipping && productFreeShipping) {
            return false
            }
        }
        if (ratingValue && ratingValue !== Number(productRating?.toFixed())) {
            return false
        }
        if (priceRange) {
            return priceRange[0] <= product.price && product.price <= priceRange[1]
        }
        return true
    })

    const renderProducts = filteredProducts.map((product, idx) => {
        const productName = product.name
        const productId = product.id
        const productPrice = product.price
        const productRating = product.ratingAverage
        const productRatingCount = product.ratingCount
        const loadingType = idx < 5 ? "eager" : "lazy"

        return (
            <ProductCard
                key={productId}
                loadingType={loadingType}
                id={productId}
                name={productName}
                image='https://i.imgflip.com/9xjeoy.jpg'
                price={productPrice}
                originalPrice={productPrice}
                average={productRating}
                count={productRatingCount}
            />
        )
    })

    return (
        <div
            style={{ display: 'flex', flexWrap: 'wrap' }}
        >
            {renderProducts}
        </div>
    )
}

export default ProductList