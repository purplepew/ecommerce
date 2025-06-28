import { useEffect } from 'react'
import { GET_PRODUCTS_QUERY } from '@/graphql/query'
import { useQuery } from 'urql'
import { Product } from '../products/ProductList'

function PrefetchImages() {
    const [result] = useQuery({ query: GET_PRODUCTS_QUERY })

    useEffect(() => {
        if (result.data?.products) {
            result.data.products.map((product: Product, index: number) => {
                if (product.image && index < 10) {
                    const img = new Image()
                    img.src = product.image
                }
            })
        }
    }, [result.data])

    return null
}

export default PrefetchImages