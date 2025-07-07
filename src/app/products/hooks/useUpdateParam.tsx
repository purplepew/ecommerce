'use client'

import { useRouter, usePathname } from "next/navigation";

export default function useUpdateParam() {
  const router = useRouter()
  const pathname = usePathname()

  return (params: Record<string, number | string | boolean | null>) => {
    const newParam = new URLSearchParams(window.location.search)

    for (const key in params) {
      const value = params[key]
      if (value == null) {
        newParam.delete(key)
      } else {
        newParam.set(key, String(value))
      }
    }

    router.replace(`${pathname}?${newParam.toString()}`, { scroll: false })
  }
}
