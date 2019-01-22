import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { NgForm } from '@angular/forms';
import { UpvotePostGQL } from './graphql.service';

const CurrentUserForProfile = gql`
  query CurrentUserForProfile {
    links {
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

const CREATE_LINK_MUTATION = gql`
  mutation CreateLinkMutation($description: String!, $url: String!) {
    createLink(description: $description, url: $url) {
      id
      url
      description
      postedBy {
        id
        username
      }
    }
  }
`;

@Component({
  selector: 'pm-links',
  templateUrl: './links.component.html',
})
export class LinksComponent implements OnInit {
  links: any[] = [];
  loading = true;
  error: any;

  private querySubscription;

  constructor(private apollo: Apollo, private upvotePostGQL: UpvotePostGQL) {}

  ngOnInit() {
    this.loadLinks();
  }

  loadLinks() {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: CurrentUserForProfile,
      })
      .valueChanges.subscribe(result => {
        this.links = result.data.links;
      });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }

  onSubmit(f: NgForm) {
    this.createLink(f.value.first, f.value.last);
  }

  createLink(url: string, description: string) {
    this.apollo
      .mutate({
        mutation: CREATE_LINK_MUTATION,
        variables: {
          description: description,
          url: url,
        },
        refetchQueries: [
          {
            query: CurrentUserForProfile,
          },
        ],
      })
      .subscribe(
        response => {
          this.loadLinks();
        },
        err => console.log(err)
      );
    this.loadLinks();
  }
}
