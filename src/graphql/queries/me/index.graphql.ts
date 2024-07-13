import { gql } from "@apollo/client";

export const getMe = gql`
  query getMe {
    me {
      id
      sub
      name
      last_name
      email
      created_at
      updated_at
      deleted_at
      memberships {
        id
        team {
          id
          name
        }
        role
      }
      assignments {
        id
        project {
          name
        }
        role
      }
    }
  }
`;
