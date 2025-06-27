export const GET_PRODUCTS_QUERY = `
    query {
        products {
            id
            name
            price
            freeShipping
            image
        }
    }
`

export const GET_USERS_QUERY = `
    query {
        users {
            id
            username
        }
    }
`
export const GET_PRODUCT_RATINGS = `
     query GetProductRatings($productId: Int!) {
    getProductRatings(productId: $productId) {
      count
      average
      productId
    }
  }
`