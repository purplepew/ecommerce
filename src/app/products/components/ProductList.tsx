import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@mui/material'
import { useGetProductsInChunksQuery } from '@/slices/productsApiSlice'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { selectAllProducts } from '@/slices/productSlice'

function ProductList() {
    console.log('R')

    const params = useSearchParams()

    const ratingValueParam = params.get('ratingValue');
    const minPriceParam = params.get('minValue');
    const maxPriceParam = params.get('maxValue');

    const validRatingParam = ratingValueParam ? JSON.parse(ratingValueParam) : null;
    const validMinPriceParam = minPriceParam ? JSON.parse(minPriceParam) : null;
    const validMaxPriceParam = maxPriceParam ? JSON.parse(maxPriceParam) : null;

    const [ratingValue, setRatingValue] = useState<number | null>(validRatingParam);
    const [minPriceValue, setMinPriceValue] = useState<number | null>(validMinPriceParam)
    const [maxPriceValue, setMaxPriceValue] = useState<number | null>(validMaxPriceParam)

    const [page, setPage] = useState(1);
    const pageSize = 4;

    const { isSuccess, isLoading } = useGetProductsInChunksQuery({
        page,
        pageSize,
    })

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

    // INFINITE SCROLL
    useEffect(() => {
        const handleScroll = () => {
            if(ratingValue) return
            const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
            if (bottom) {
                setPage(prev => prev + 1)
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                    console.log('CALLED1111')
                    return null;
                }
            }
            
            if (maxPriceValue) {
                if (product.price > maxPriceValue) {
                    console.log('CALLED222')
                    return null;
                }
            }

            return (
                <ProductCard
                    id={product.id}
                    key={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    originalPrice={product.price + 1}
                    loadingType={index < 7 ? 'eager' : 'lazy'}
                    ratingsAverage={product.ratingsAverage ?? null}
                    ratingsCount={product.ratingsCount ?? 0}
                    urlRatingValue={ratingValue}
                />
            )
        })
        content = renderProducts
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