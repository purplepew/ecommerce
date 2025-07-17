import { useEffect } from 'react'
import productsApiSlice from '@/slices/productsApiSlice'
import { store } from '@/lib/store'

function PrefetchImages() {

    useEffect(() => {
        console.log('CALLED')
        store.dispatch(productsApiSlice.util.prefetch('getProductsInChunks', { page: 1, pageSize: 4 }, {force: true}))
    }, [])

    return null
}

export default PrefetchImages