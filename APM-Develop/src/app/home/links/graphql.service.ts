import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root',
})
export class UpvotePostGQL extends Mutation {
  document = gql`
    mutation CreateLInk($description: String!, $url: String!) {
      createLink(description: $description, url: $url) {
        id
        description
        url
        postedBy {
          id
          username
        }
      }
    }
  `;
}
