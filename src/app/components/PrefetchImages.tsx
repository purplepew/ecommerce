import { useEffect } from 'react'
import productsApiSlice from '@/slices/productsApiSlice'
import { store } from '@/lib/store'

function PrefetchImages() {

    useEffect(() => {
        console.log('CALLED')
        store.dispatch(productsApiSlice.util.prefetch('getProductsInChunks', { page: 1, pageSize: 20 }, {force: true}))
        store.dispatch(productsApiSlice.util.prefetch('getProductsInChunks', { page: 2, pageSize: 20 }, {force: true}))
    }, [])

    return null
}

export default PrefetchImages