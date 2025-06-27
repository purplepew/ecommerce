import { Product, selectAllProducts } from '@/slices/productSlice'
import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import { useSearchParams } from 'next/navigation'

function ProductList() {
    const products = useSelector(selectAllProducts) as Product[]
    const imageCountRef = useRef(0)
    const rerenderRef = useRef(0)
    const params = useSearchParams()

    const priceRangeParam = params.get('priceRange')
    const priceOrderParam = params.get('priceOrder')
    const priceRange = priceRangeParam ? (JSON.parse(priceRangeParam) as number[]) : null
    const priceOrder = priceOrderParam ? (JSON.parse(priceOrderParam) as 1 | 2 | 3) : null

    rerenderRef.current++;
    console.log("RERENDER: ", rerenderRef.current)

    const sortedProducts = priceOrder == 1 || priceOrder == null
        ? products
        : products.slice().sort((a, b) => priceOrder == 2 ? a.price - b.price : b.price - a.price)

    const renderProducts = sortedProducts.map(product => {
        const productName = product.name
        const productId = product.id
        const productPrice = product.price
        const productRating = product.ratingAverage
        const productRatingCount = product.ratingCount

        if (priceRange) {
            console.log(priceRange)
            if (priceRange[0] <= productPrice && productPrice <= priceRange[1]) {
                const loadingType = imageCountRef.current++ < 5 ? "eager" : "lazy"
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
            }
        } else {
            const loadingType = imageCountRef.current++ < 5 ? "eager" : "lazy"
            return (
                <ProductCard
                    key={productId}
                    loadingType={loadingType}
                    id={productId}
                    name={productName}
                    image='https://i.imgflip.com/9xjeoy.jpg'
                    price={productPrice}
                    originalPrice={productPrice}
                />
            )
        }
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