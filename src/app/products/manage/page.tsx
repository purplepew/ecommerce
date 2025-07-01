'use client'
import { useGetAllProductsQuery } from "@/slices/productsApiSlice"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material"

import { useState } from "react"

type ColumnNames = 'id' | 'name' | 'price' | 'freeShipping'

type HeadCell = {
    id: ColumnNames,
    label: string,
}

type Order = 'asc' | 'desc'

const headCells: HeadCell[] = [
    {
        id: 'id',
        label: 'ID'
    },
    {
        id: 'name',
        label: 'Name'
    },
    {
        id: 'price',
        label: 'Price'
    },
    {
        id: 'freeShipping',
        label: 'Free Shipping'
    }
]

function page() {
    const [activeIndex, setActiveIndex] = useState<ColumnNames>()
    const [sort, setSort] = useState<{ dir: Order, type: ColumnNames }>({ dir: 'asc', type: 'id' })

    const { data, isSuccess, isLoading } = useGetAllProductsQuery({ sort })

    const handleSetActiveIndex = (id: ColumnNames) => {
        if (id !== activeIndex) {
            setActiveIndex(id)
        }
        setSort(sort.dir == 'asc' ? { dir: 'desc', type: id } : { dir: 'asc', type: id })
    }

    if (data && isSuccess) {

        return (
            <TableContainer component={Paper} sx={{ width: 600, margin: '2.5rem auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headCells.map((head, index) => {
                                return (
                                    <TableCell key={index}>
                                        <TableSortLabel
                                            active={activeIndex == head.id}
                                            onClick={() => handleSetActiveIndex(head.id)}
                                            direction={sort.dir}
                                        >
                                            {head.label}
                                        </TableSortLabel>
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.ids.map((id, index) => {
                            const product = data.entities[id]
                            return (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.freeShipping ? 'FREE' : ''}</TableCell>
                                </TableRow>
                            )
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
        )
    } else if (isLoading) {
        return <p>Loading...</p>
    }
}

export default page