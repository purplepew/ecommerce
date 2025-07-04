import { useEffect } from 'react'
import { useGetProductsInChunksQuery } from '@/slices/productsApiSlice'

function PrefetchImages() {

    const { data, isSuccess } = useGetProductsInChunksQuery({})

    useEffect(()=>{
        if(data && isSuccess){
            data.ids.map(id => {
                const product = data.entities[id]
                if(product.image){
                    const optimizedUrl = `/_next/image?url=${encodeURIComponent(product.image)}&w=1080&q=1`
                    const image = new Image()
                    image.src = optimizedUrl
                }
            })
        }
    },[isSuccess])

    return null
}

export default PrefetchImages