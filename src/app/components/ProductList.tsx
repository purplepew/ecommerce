'use client';
import { useSelector } from 'react-redux';
import { selectAllProducts } from '@/slices/productSlice';
import { List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import type { Product } from '@/slices/productSlice';

export default function ProductList() {
    const products = useSelector(selectAllProducts) as Product[];
    return (
        <List>
            {products.map((product) => (
                <ListItem key={product.id}>
                    <ListItemButton>
                        <ListItemText primary={product.name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}
