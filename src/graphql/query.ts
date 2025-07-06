export const GET_PRODUCTS_QUERY = `
 query ($page: Int, $pageSize: Int) {
  products(page: $page, pageSize: $pageSize) {
    id
    name
    price
    freeShipping
    image
    createdAt
    updatedAt
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
     query ($productId: Int!) {
    getProductRatings(productId: $productId) {
      count
      average
    }
  }
`