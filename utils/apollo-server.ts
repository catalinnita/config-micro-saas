import { Database } from "@/types/db";
import { cookies } from 'next/headers';
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_SUPABASE_GRAPHQL_URL,
});

export const authLink = setContext(async (_, { headers }) => {
    const supabase = createServerComponentClient<Database>({ cookies })
    const { data } = await supabase.auth.getSession();
    const authToken = data.session?.access_token

    return {
        headers: {
            ...headers,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            authorization: authToken ? `Bearer ${authToken}` : "",
        }
    }
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
          },
          query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },
    },
});