import React, { useEffect, useMemo, useState } from 'react'
import ProductCard from './ProductCard'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@mui/material'
import { useQuery } from 'urql'
import { GET_PRODUCTS_QUERY } from '@/graphql/query'

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    ratingCount?: number;
    ratingAverage?: number;
    freeShipping?: boolean;
    image?: string
}

function ProductList() {
    const params = useSearchParams()
    const [isLoading, setIsLoading] = useState(true);
    const [result] = useQuery({ query: GET_PRODUCTS_QUERY })
    const products: Product[] = result.data?.products ?? []

    useEffect(() => {
        if (result.fetching) {
            setIsLoading(true);
            return;
        }
        if (result.data && result.data.products && result.data.products.length > 0) {
            setIsLoading(false);
        } else {
            // If products are empty on initial load, and you expect them to load,
            // you might want a timeout or a state indicating fetch status.
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [products])

    const priceRangeParam = params.get('priceRange')
    const priceOrderParam = params.get('priceOrder')
    const freeShippingParam = params.get('freeShipping')
    const priceRange = priceRangeParam ? (JSON.parse(priceRangeParam) as number[]) : null
    const priceOrder = priceOrderParam ? (JSON.parse(priceOrderParam) as 1 | 2 | 3) : null
    const freeShipping = freeShippingParam ? (JSON.parse(freeShippingParam) as boolean) : null

    const sortedProducts = useMemo(() => {
        return priceOrder == 1 || priceOrder == null
            ? products
            : products.slice().sort((a, b) => priceOrder == 2 ? a.price - b.price : b.price - a.price)
    }, [priceOrder, products])

    const filteredProducts = sortedProducts.filter(product => {
        const productFreeShipping = product.freeShipping

        if (typeof freeShipping === 'boolean') {
            if (freeShipping && !productFreeShipping) {
                return false
            }
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

        const loadingType = idx < 5 ? "eager" : "lazy"
        const productImage = product.image

        return (
            <ProductCard
                key={productId}
                loadingType={loadingType}
                id={productId}
                name={productName}
                image={productImage}
                price={productPrice}
                originalPrice={productPrice}
            />
        )
    })
    const numSkeletons = 8; // Or any number appropriate for your layout (e.g., 8-12)
    const renderSkeletons = Array.from({ length: numSkeletons }).map((_, index) => (
        <Skeleton
            key={index}
            variant="rectangular"
            width={250}
            height={350}
            style={{ borderRadius: 8 }}
        />
    ));

    return (
        <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
        >
            {isLoading ? renderSkeletons : renderProducts}
        </div>
    );
}

export default ProductList