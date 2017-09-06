import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = `
  
  type Link {
    id: ID!
    url: String!
    description: String!
    postedBy: User
    votes: [Vote!]!
  }
  
  type User {
    id: ID!
    name: String!
    email: String
    password: String
    votes: [Vote!]!
  }
  
  type SigninPayload {
    token: String
    user: User
  }
  
  type Vote {
  id: ID!
  user: User!
  link: Link!
  }
  
  input AuthProviderSignupData {
    email: AUTH_PROVIDER_EMAIL
  }

  input AUTH_PROVIDER_EMAIL {
    email: String!
    password: String!
  }
  
  type Query {
    allLinks(filter: LinkFilter, skip:Int, first:Int): [Link!]!
  }
  
  input LinkFilter {
    OR: [LinkFilter!]
    description_contains: String
    url_contains: String
}
  
  type Mutation {
    createLink(url: String!, description: String!): Link
    createVote(linkId: ID!): Vote
    createUser(name: String!, authProvider: AuthProviderSignupData!): User
    signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
  }
    
  enum _ModelMutationType {
    CREATED
    UPDATED
    DELETED
  }
  
  input LinkSubscriptionFilter {
    mutation_in: [_ModelMutationType!]
  }
  
  type LinkSubscriptionPayload {
    mutation: _ModelMutationType
    node: Link
  }
  
  type Subscription {
    userAlterLink(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
  }

schema {
  query: Query
  mutation: Mutation
  subscription: Subscription
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };