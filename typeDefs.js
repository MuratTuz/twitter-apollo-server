import { gql } from "graphql-tag";
export const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    tweets: [Tweet]
    image: String
    likesTweet: [Tweet]
  }
  type Tweet {
    _id: ID
    user: User!
    username: String!
    text: String!
    title: String!
    images: [String]
    likes: Int
    likedUser: [ID]
    createdAt: String
  }
  type Query {
    getUsers: [User]!
    getTweets: [Tweet]
    getUserTweets(user: ID!): [Tweet]
    deleteTweet(_id: ID): [Tweet]
    getUserLikedTweets(_id: ID): [Tweet]
  }
  type Likes {
    likes: Int
    likesTweet: [Tweet]
  }
  type Token {
    token: String!
    username: String!
    _id: ID!
  }
  type Mutation {
    createTweet(
      user: ID!
      username: String!
      text: String!
      title: String!
      images: [String]
    ): Tweet!
    createUser(username: String!, email: String!, password: String!): Token
    login(username: String!, email: String!, password: String!): Token
    addLike(_id: ID!, username: String!): Likes!
    unLike(_id: ID!, username: String!): Likes!
  }
`;
