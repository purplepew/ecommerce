export const ADD_PRODUCT_MUTATION = `
  mutation ($name: String!, $price: Float!, $description: String!) {
    addProduct(name: $name, price: $price, description: $description) {
      id
      name
      price
      description
    }
  }
`;