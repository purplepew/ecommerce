'use client'
import React, { useState } from 'react';
import { Stack, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import { useMutation } from 'urql';
import { ADD_PRODUCT_MUTATION } from '@/graphql/mutations'

export default function ProductForm() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        freeShipping: false,
    });

    const [feedback, setFeedback] = useState({ message: '', ok: true });
    const [addProductResult, addProduct] = useMutation(ADD_PRODUCT_MUTATION);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name, price, image } = formData;

        if (!name || !price || !image) {
            setFeedback({ message: 'All fields are required.', ok: false });
            return;
        }

        try {
            const variables = {
                name,
                price: parseFloat(price),
                image,
                freeShipping: formData.freeShipping,
            };

            const result = await addProduct(variables);
            console.log(result);

            if (result.error) {
                setFeedback({ message: 'Failed to create product.', ok: false });
            } else {
                setFeedback({ message: 'Product created successfully!', ok: true });
                setFormData({ name: '', price: '', image: '', freeShipping: false });
            }
        } catch (error) {
            console.log(error);
            setFeedback({ message: 'An error occurred.', ok: false });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack
                p={1}
                m="0 auto"
                width={400}
                mt={2}
                textAlign="center"
                direction="column"
                gap={1}
            >
                <TextField
                    label="Product name"
                    variant="filled"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Product price"
                    type="number"
                    variant="filled"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Product image URL"
                    variant="filled"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.freeShipping}
                            onChange={handleChange}
                            name="freeShipping"
                        />
                    }
                    label="Free shipping"
                    sx={{ color: 'rgba(0,0,0,.6)' }}
                />
                <Button variant="contained" type="submit">
                    Create product
                </Button>
                {feedback.message && (
                    <p style={{ color: feedback.ok ? 'green' : 'red' }}>{feedback.message}</p>
                )}
            </Stack>
        </form>
    );
}
