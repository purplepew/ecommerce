import { useEffect } from 'react'
import { GET_PRODUCTS_QUERY } from '@/graphql/query'
import { useQuery } from 'urql'
import { Product } from '../products/ProductList'

function PrefetchImages() {
    const [result] = useQuery({ query: GET_PRODUCTS_QUERY })

    useEffect(() => {
        if (result.data?.products) {
            result.data.products.map((product: Product) => {
                if (product.image) {
                    const img = new Image()
                    img.src = product.image
                }
            })
        }
    }, [result.data])

    return null
}

export default PrefetchImages