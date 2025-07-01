import React, { ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { Skeleton } from '@mui/material'
import { useGetAllProductsQuery } from '@/slices/productsApiSlice'
import ProductCard from './ProductCard'

export type Product = {
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
    
        const priceRangeParam = params.get('priceRange')
        const priceOrderParam = params.get('priceOrder')
        const freeShippingParam = params.get('freeShipping')
        const priceRange = priceRangeParam ? (JSON.parse(priceRangeParam) as number[]) : [undefined, undefined]
        const priceOrder = priceOrderParam ? (JSON.parse(priceOrderParam) as 1 | 2 | 3) : null
        const freeShipping = freeShippingParam ? (JSON.parse(freeShippingParam) as boolean) : undefined

    const { data, isSuccess, isLoading } = useGetAllProductsQuery({minPrice: priceRange[0], maxPrice: priceRange[1], freeShipping})

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
        const renderProducts = data.ids.map(id => {
            const product = data.entities[id]
            console.log(product)
 
            return (
                <ProductCard
                    id={product.id}
                    key={product.id}
                    name={product.name}
                    image={product.image}
                    price={product.price}
                    originalPrice={product.price + 1}
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