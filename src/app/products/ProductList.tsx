import { getProducts, Product, selectAllProducts } from '@/slices/productSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import { AppDispatch } from '@/lib/store'

function ProductList() {
    const dispatch: AppDispatch = useDispatch()
    const products = useSelector(selectAllProducts) as Product[]



    // console.log(products)
    // const renderProducts = products.map(product => {
    //     return (
    //         <ProductCard
    //             key={product.id}
    //             id={product.id}
    //             image='https://i.imgflip.com/9xjeoy.jpg'
    //             name={product.name}
    //             price={product.price}
    //             originalPrice={product.price}
    //         />
    //     )
    // })

    const renderProducts = Array.from({ length: 8 }, (v, i) => {
        return <ProductCard
                key={i}
                id={i+''}
                image='https://i.imgflip.com/9xjeoy.jpg'
                name={"Pumpkin"}
                price={445}
                originalPrice={446}
            />
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