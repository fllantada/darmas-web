"use server";

import {
  Mutation,
  Query,
  UserMutationsUpdateUserAccessArgs,
} from "@/generated/graphql";
import { gql } from "@apollo/client";

import { getClient } from "@/app/plataform/lib/apiClient";

import { Role, type User } from "./store";

export async function getUsers(): Promise<User[]> {
  const gqlClient = getClient();

  const { data } = await gqlClient.query<Query>({
    query: gql`
      query MyQuery {
        users {
          getUsers {
            id
            details {
              email
              firstName
              lastName
              role
              deactivated
            }
          }
        }
      }
    `,
  });

  return data.users.getUsers.map(user => ({
    id: user.id,
    name: (user.details.firstName || "") + " " + (user.details.lastName || ""),
    email: user.details.email,
    role: user.details.role as Role,
    deactivated: user.details.deactivated,
  }));
}

export async function setUserAccess(
  userId: string,
  deactivated: boolean,
  role: Role,
) {
  const gqlClient = getClient();

  await gqlClient.mutate<Mutation, UserMutationsUpdateUserAccessArgs>({
    mutation: gql`
      mutation UserAccess(
        $userId: ID!
        $role: String!
        $deactivated: Boolean!
      ) {
        users {
          updateUserAccess(
            deactivated: $deactivated
            role: $role
            userId: $userId
          ) {
            id
          }
        }
      }
    `,
    variables: {
      userId,
      deactivated,
      role: (role || Role.User).toString(),
    },
  });
}
