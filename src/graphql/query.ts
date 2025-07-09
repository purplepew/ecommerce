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

export const GET_CART = `
  query ($userId: Int!) {
    getCart(userId: $userId){
       id
    userId
    status
    cartItems {
      products {
        id
        name
        price
        image
        }
        quantity
    }
    createdAt
    updatedAt
  }
}
`

export const GET_PRODUCT_BY_ID = `
query ($productId: Int!){
  productById(productId: $productId) {
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