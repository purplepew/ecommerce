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

    const priceOrderParam = params.get('priceOrder')
    const validSortParam = JSON.parse(priceOrderParam as string) ?? null
    const [priceOrder, setPriceOrder] = useState<'asc' | 'desc' | null>(validSortParam)

    const [page, setPage] = useState(1)
    const pageSize = 20

    const { isSuccess, isLoading } = useGetProductsInChunksQuery({
        page,
        pageSize,
        ...(priceOrder && {
            sort: {
                type: 'price',
                dir: priceOrder
            }
        })
    })

    const products = useSelector(selectAllProducts)

    const [sortAsc, sortDesc] = useMemo(() => {
        console.log('SORTING')
        const sortAsc = [...products].sort((a, b) => a.price - b.price);
        const sortDesc = [...products].sort((a, b) => b.price - a.price);
        return [sortAsc, sortDesc]
    }, [products])

    useEffect(() => {
        setPriceOrder(validSortParam)
    }, [validSortParam])

    useEffect(() => {
        setPage(1)
    }, [validSortParam])

    let content: ReactNode

    if (isLoading) {
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
        content = renderSkeletons
    } else if (isSuccess && products) {

        const renderProducts = [...(priceOrder == null
            ? products
            : priceOrder == 'asc' ? sortAsc : sortDesc)].map((product, index) => {

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
                    />
                )
            })
        content = renderProducts
    } else {
        content = <p>Error</p>
    }

    return (
        <>
            <div
                style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}
            >
                {content}
            </div>
            <button onClick={() => setPage(page + 1)}>Next Page?</button>
        </>
    );
}

export default ProductList