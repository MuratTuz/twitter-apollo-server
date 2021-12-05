import { ApolloServer } from "apollo-server";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";
import { db } from "./db.js";
import User from "./models/user.js";
import Tweet from "./models/tweet.js";
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Tweet,
  },
});
db();
server.listen({port:process.env.PORT || 4000}).then(({ url }) => {
  console.log(`listening on ${url}`);
});
