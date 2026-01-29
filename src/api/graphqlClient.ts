import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({
  //uri: "https://api-production-7ca8.up.railway.app/graphql",
  uri: "http://localhost:8000/graphql",
});

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
