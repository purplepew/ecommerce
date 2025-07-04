export const GET_PRODUCTS_QUERY = `
 query ($page: Int, $pageSize: Int, $sort: SortInput, $averageRatings: Int) {
  products(page: $page, pageSize: $pageSize, sort: $sort, averageRatings: $averageRatings) {
    id
    name
    price
    freeShipping
    image
    ratingsAverage
    ratingsCount
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
     query GetProductRatings($productId: Int!) {
    getProductRatings(productId: $productId) {
      count
      average
      productId
    }
  }
`