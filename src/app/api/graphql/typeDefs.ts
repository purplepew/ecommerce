const typeDefs = `
     scalar DateTime

type Product {
  id: Int!
  name: String!
  price: Float!
  freeShipping: Boolean
  createdAt: DateTime
  updatedAt: DateTime
  reviews: [Review!]
  image: String
  ratingsAverage: Float
  ratingsCount: Int
  cartItems: [CartItem!]
}

type Review {
  id: Int!
  productId: Int!
  userId: Int!
  rating: Int!
  createdAt: DateTime
  updatedAt: DateTime
  product: Product!
  user: User! 
}

type User {
  id: Int!
  email: String!
  username: String
  password: String
  createdAt: DateTime
  updatedAt: DateTime
  reviews: [Review!]!
  carts: [Cart!]
}

type Cart {
  id: Int!
  userId: Int!
  status: String!
  createdAt: DateTime
  updatedAt: DateTime
  cartItems: [CartItem!]
  }

type CartItem {
  id: Int!
  productId: Int!
  cartId: Int!
  quantity: Int!
  price: Float!
  addedAt: DateTime
  products: Product # should be product singular haha. but too lazy to migrate schema.prisma
  carts: Cart
}

type ProductRatingsResult {
  count: Int!
  average: Float
}

input SortInput {
  dir: String! 
  type: String! 
}

type Query {
 products(page: Int, pageSize: Int): [Product!]!
 getProductRatings(productId: Int!): ProductRatingsResult!
 reviews: [Review!]!
 users: [User!]!,
 productById(productId: Int!): Product
 getCart(userId: Int!): Cart
 }
 
 type Mutation {
  addProduct(name: String!, price: Float!, image: String!, freeShipping: Boolean): Product!
  addReview(productId: Int!, userId: Int!, rating: Int!): Review!
  addUser( email: String!, username: String, password: String ): User!
  deleteProduct(id: Int!): Product
  addProductsBulk(numberOfProducts: Int!): [Product!]!
  createCart(userId: Int!): Cart!
  addCartItem(cartId: Int!, productId: Int!, price: Float!, quantity: Int!): CartItem!
}
    `

export default typeDefs