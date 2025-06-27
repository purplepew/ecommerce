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