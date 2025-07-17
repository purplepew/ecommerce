'use client'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Skeleton } from '@mui/material'
import { useGetProductByFiltersQuery, useGetProductsInChunksQuery } from '@/slices/productsApiSlice'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { selectAllProducts } from '@/slices/productSlice'

function ProductList() {
    console.log('R')

    const params = useSearchParams()

    const ratingValueParam = params.get('ratingValue');
    const minPriceParam = params.get('minValue');
    const maxPriceParam = params.get('maxValue');
    const shippingParam = params.get('freeShipping');

    const validRatingParam = useCallback(() => ratingValueParam ? JSON.parse(ratingValueParam) : null, [ratingValueParam])
    const validMinPriceParam = useCallback(() => minPriceParam ? JSON.parse(minPriceParam) : null, [minPriceParam])
    const validMaxPriceParam = useCallback(() => maxPriceParam ? JSON.parse(maxPriceParam) : null, [maxPriceParam])
    const validShippingParam = useCallback(() => shippingParam ? JSON.parse(shippingParam) : null, [shippingParam])

    const [ratingValue, setRatingValue] = useState<number | null>(validRatingParam)
    const [minPriceValue, setMinPriceValue] = useState<number | null>(validMinPriceParam)
    const [maxPriceValue, setMaxPriceValue] = useState<number | null>(validMaxPriceParam)
    const [isFreeShipping, setIsFreeShipping] = useState<boolean | null>(validShippingParam)

    const [page, setPage] = useState(1);
    const pageSize = 4;

    const { isSuccess, isLoading } = useGetProductsInChunksQuery({
        page,
        pageSize,

    })

    useGetProductByFiltersQuery({ averageRating: ratingValue, page, pageSize }, { skip: !Boolean(ratingValue) })
    useGetProductByFiltersQuery({ minValue: minPriceValue, page, pageSize }, { skip: !Boolean(minPriceValue) })
    useGetProductByFiltersQuery({ maxValue: maxPriceValue, page, pageSize }, { skip: !Boolean(maxPriceValue) })
    useGetProductByFiltersQuery({ freeShipping: isFreeShipping, page, pageSize }, { skip: Boolean(isFreeShipping) == false })

    const products = useSelector(selectAllProducts);

    // RATING VALUE 
    useEffect(() => {
        setRatingValue(validRatingParam)
    }, [validRatingParam])

    // MIN PRICE VALUE
    useEffect(() => {
        setMinPriceValue(validMinPriceParam)
    }, [validMinPriceParam])

    // MAX PRICE VALUE
    useEffect(() => {
        setMaxPriceValue(validMaxPriceParam)
    }, [validMaxPriceParam])

    // MAX PRICE VALUE
    useEffect(() => {
        setIsFreeShipping(validShippingParam)
    }, [validShippingParam])

    let content: ReactNode

    if (isLoading) {
        const numSkeletons = 4
        const renderSkeletons = Array.from({ length: numSkeletons }).map((_, index) => (
            <Skeleton
                key={index}
                variant="rectangular"
                width={280}
                height={350}
                style={{ borderRadius: 8 }}
            />
        ));
        content = renderSkeletons
    } else if (isSuccess && products) {

        const renderProducts = products.map((product, index) => {

            if (minPriceValue) {
                if (product.price < minPriceValue) {
                    return null;
                }
            }

            if (maxPriceValue) {
                if (product.price > maxPriceValue) {
                    return null;
                }
            }

            if (isFreeShipping) {
                if (product.freeShipping == false) {
                    return
                }
            }

            return (
                <ProductCard
                    id={product.id}
                    key={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    originalPrice={product.id % 3 == 0 ? product.price + 1 : product.price}
                    loadingType={index < 7 ? 'eager' : 'lazy'}
                    urlRatingValue={ratingValue}
                />
            )
        })
        content = (
            <>
                {renderProducts}
                <Button onClick={()=>setPage(prev => prev + 1)}>Next</Button>
            </>

        )
    } else {
        content = <p>Error</p>
    }

    return (
        <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
        >
            {content}
        </div>
    );
}

export default ProductList