import React, { ReactNode, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@mui/material'
import { useGetAllProductsQuery } from '@/slices/productsApiSlice'
import ProductCard from './ProductCard'

function ProductList() {
    const params = useSearchParams()

    console.log('RERENDER!!')

    const priceRangeParam = params.get('priceRange')
    const priceOrderParam = params.get('priceOrder')
    const freeShippingParam = params.get('freeShipping')
    const priceRange = priceRangeParam ? (JSON.parse(priceRangeParam) as number[]) : [undefined, undefined]
    const priceOrder = priceOrderParam ? (JSON.parse(priceOrderParam) as 'asc' | 'desc') : undefined
    const freeShipping = freeShippingParam ? (JSON.parse(freeShippingParam) as boolean) : undefined

    const [visibleCount, setVisibleCount] = useState(10); // initial batch size

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 // near bottom
            ) {
                setVisibleCount((prev) => prev + 10); // load 10 more
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data, isSuccess, isLoading } = useGetAllProductsQuery({
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        freeShipping,
        ...(priceOrder && { sort: { type: 'price', dir: priceOrder } })
    })

    const numSkeletons = 5; // Or any number appropriate for your layout (e.g., 8-12)
    const renderSkeletons = Array.from({ length: numSkeletons }).map((_, index) => (
        <Skeleton
            key={index}
            variant="rectangular"
            width={280}
            height={350}
            style={{ borderRadius: 8 }}
        />
    ));

    let content: ReactNode

    if (isLoading) {
        content = renderSkeletons
    } else if (isSuccess && data) {

        const renderProducts = data.ids.slice(0, visibleCount).map((id, index) => {
            const product = data.entities[id]
            return (
                <ProductCard
                    id={product.id}
                    key={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    originalPrice={product.price + 1}
                    loadingType={index < 7 ? 'eager' : 'lazy'}
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