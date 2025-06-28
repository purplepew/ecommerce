export const ADD_PRODUCT_MUTATION = `
  mutation ($name: String!, $price: Float!, $image: String!) {
    addProduct(name: $name, price: $price, image: $image) {
      id
      name
      price
      image
    }
  }
`;

export const ADD_USER_MUTATION = `
  mutation ($email: String!, $username: String, $password: String) {
    addProduct(email: $email, username: $username, password: $password) {
      email
      username
      password
    }
  }
`;