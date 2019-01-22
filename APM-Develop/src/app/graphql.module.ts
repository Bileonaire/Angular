import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { HttpHeaders } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { setContext } from 'apollo-link-context';

const uri = 'http://127.0.0.1:8000/graphql/'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink, apollo: Apollo) {
  const http = httpLink.create({ uri: uri });
  // const headers = new HttpHeaders()

  const auth = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    // const token = localStorage.getItem('token');
    const token =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJpbGVvbmFpcmUiLCJleHAiOjE1NTEwNzkxMjUsIm9yaWdfaWF0IjoxNTUxMDc4ODI1fQ.-VQoLHEvPuzTjCC9qqdezU57eE6LCvSHpIVN8fb9NaE';

    // return the headers to the context so httpLink can read them
    // in this example we assume headers property exists
    // and it is an instance of HttpHeaders
    if (!token) {
      return {};
    } else {
      return {
        headers: new HttpHeaders().set('Authorization', `JWT ${token}`)
      };
    }
  });

  return {
    link: auth.concat(http),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
