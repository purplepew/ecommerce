export const ADD_PRODUCT_MUTATION = `
  mutation AddProduct($name: String!, $price: Float!, $image: String!, $freeShipping: Boolean!) {
    addProduct(name: $name, price: $price, image: $image, freeShipping: $freeShipping) {
      id
      name
      price
      image
      freeShipping
    }
  }
`;


export const ADD_USER_MUTATION = `
  mutation ($email: String!, $username: String, $password: String) {
    addUser(email: $email, username: $username, password: $password) {
      email
      username
    }
  }
`;

export const ADD_CART_ITEM = `
  mutation ($productId: Int!, $cartId: Int!, $price: Float!, $quantity: Int!){
    addCartItem(productId: $productId, cartId: $cartId, price: $price, quantity: $quantity){
  id
  productId
  cartId
  quantity
  price
    }
  }
` 
