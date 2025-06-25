export const GET_PRODUCTS_QUERY = `
    query {
        products {
            id
            name
            price
            description
        }
    }
`