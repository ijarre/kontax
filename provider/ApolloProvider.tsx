import { ApolloClient, InMemoryCache, ApolloProvider as LibApolloProvider } from "@apollo/client";
import { PropsWithChildren } from "react";

export function ApolloProvider({ children }: PropsWithChildren) {
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL,
    cache: new InMemoryCache(),
  });

  return <LibApolloProvider client={client}>{children}</LibApolloProvider>;
}
