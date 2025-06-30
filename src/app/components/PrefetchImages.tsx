import { useEffect } from 'react'
import { useGetAllProductsQuery } from '@/slices/productsApiSlice'

function PrefetchImages() {

    const { data, isSuccess } = useGetAllProductsQuery()

    useEffect(()=>{
        if(data && isSuccess){
            data.ids.map(id => {
                const product = data.entities[id]
                if(product.image){
                    const image = new Image()
                    image.src = product.image
                }
            })
        }
    },[isSuccess])

    return null
}

export default PrefetchImages