export const GET_PRODUCTS_QUERY = `
 query ($freeShipping: Boolean, $minPrice: Float, $maxPrice: Float, $sort: SortInput) {
  products(freeShipping: $freeShipping, minPrice: $minPrice, maxPrice: $maxPrice, sort: $sort) {
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