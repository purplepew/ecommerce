'use client'
import { useSearchParams } from "next/navigation";

export type ParamKey = 'minValue' | 'maxValue' | 'ratingValue' | 'freeShipping'

export default function useGetParams(){
    const param = useSearchParams()
    return (name: ParamKey): string | null => {
        return param.get(name)
    }    
}