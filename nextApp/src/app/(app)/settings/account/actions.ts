"use server";

import {
  Mutation,
  Query,
  UserMutationsUpdateUserDetailsArgs,
  UserMutationsUpdateUserSettingsArgs,
  UserQueriesGetUserArgs,
} from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/lib/apiClient";

export async function getUser(userId: string) {
  const gqlClient = getClient();

  const { data } = await gqlClient.query<Query, UserQueriesGetUserArgs>({
    query: gql`
      query UserQuery($userId: ID!) {
        users {
          getUser(userId: $userId) {
            id
            details {
              email
              firstName
              lastName
              role
            }
            settings {
              notificationPreferences
              preferredTimezone
            }
          }
        }
      }
    `,
    variables: {
      userId,
    },
  });

  return data.users.getUser;
}

export async function updateUserDetails(
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  password: string | undefined,
) {
  const gqlClient = getClient();

  const { data } = await gqlClient.mutate<
    Mutation,
    UserMutationsUpdateUserDetailsArgs
  >({
    mutation: gql`
      mutation UserDetails(
        $userId: ID!
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String
      ) {
        users {
          updateUserDetails(
            userId: $userId
            email: $email
            firstName: $firstName
            lastName: $lastName
            password: $password
          ) {
            id
          }
        }
      }
    `,
    variables: {
      userId,
      firstName,
      lastName,
      email,
      password,
    },
  });

  return data?.users.updateUserDetails;
}

export async function updateUserSettings(
  userId: string,
  preferredTimezone: string,
  notificationPreferences: string,
) {
  const gqlClient = getClient();

  const { data } = await gqlClient.mutate<
    Mutation,
    UserMutationsUpdateUserSettingsArgs
  >({
    mutation: gql`
      mutation UserSettings(
        $notificationPreferences: String!
        $preferredTimezone: String!
        $userId: ID!
      ) {
        users {
          updateUserSettings(
            notificationPreferences: $notificationPreferences
            preferredTimezone: $preferredTimezone
            userId: $userId
          ) {
            id
          }
        }
      }
    `,
    variables: {
      userId,
      notificationPreferences,
      preferredTimezone,
    },
  });

  return data?.users.updateUserDetails;
}
