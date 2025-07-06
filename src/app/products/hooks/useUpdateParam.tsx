'use client'

import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function updateParam() {
    const router = useRouter()
    const param = useSearchParams()
    const pathname = usePathname()

    return (key: string, value: number | string | boolean | null) => {
        const newParam = new URLSearchParams(param.toString())

        if (value == null) {
            newParam.delete(key)
            router.replace(`${pathname}?${newParam.toString()}`, { scroll: false })
            return
        }

        newParam.set(key, JSON.stringify(value))
        router.replace(`${pathname}?${newParam.toString()}`, { scroll: false })
    }
}