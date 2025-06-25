'use client'
import React, { ReactNode } from 'react'
import { AppDispatch } from '@/lib/store';
import { useEffect } from 'react';
import { getProducts } from '@/slices/productSlice'
import { useDispatch } from 'react-redux';

function layout({ children }: { children: ReactNode }) {

    const dispatch: AppDispatch = useDispatch()

    useEffect(() => {
        dispatch(getProducts())
    }, [])

    return <>{children}</>
}

export default layout