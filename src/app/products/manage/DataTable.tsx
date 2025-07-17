'use client'
import { useGetProductsInChunksQuery } from "@/slices/productsApiSlice"
import { Delete } from "@mui/icons-material"
import { IconButton, InputBase, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel } from "@mui/material"
import { ProductColumnNames, SortOrder } from "@/slices/productsApiSlice"

import { useState } from "react"

type HeadCell = {
    id: ProductColumnNames,
    label: string,
}

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
    },
    {
        id: 'image',
        label: 'Image'
    }
]

export default function DataTable() {
    const [activeIndex, setActiveIndex] = useState<ProductColumnNames>()
    const [sort, setSort] = useState<{ dir: SortOrder, type: ProductColumnNames }>({ dir: 'asc', type: 'id' })
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)

    const { data, isSuccess, isLoading } = useGetProductsInChunksQuery({ sort })

    const handleSetActiveIndex = (id: ProductColumnNames) => {
        if (id !== activeIndex) {
            setActiveIndex(id)
        }
        setSort(sort.dir == 'asc' ? { dir: 'desc', type: id } : { dir: 'asc', type: id })
    }

    if (data && isSuccess) {

        return (
            <TableContainer component={Paper} sx={{ margin: '2.5rem auto' }}>
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
                            <TableCell>
                                actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.ids
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((id) => {
                                const product = data.entities[id]
                                return (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>{product.price}</TableCell>
                                        <TableCell>{product.freeShipping ? 'FREE' : ''}</TableCell>
                                        <TableCell>
                                            <InputBase
                                                defaultValue={product.image}
                                                readOnly
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        outline: 'none',
                                                    },
                                                    '& .MuiInputBase-input:focus': {
                                                        border: '1px solid #2f2f2f',
                                                        borderRadius: '4px',
                                                    },
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <IconButton>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={data.ids.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                onRowsPerPageChange={e => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[2, 5, 10, 25]}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        )
    } else if (isLoading) {
        return <p>Loading...</p>
    }
}