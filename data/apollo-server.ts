import { projectsQuery } from "@/data/queries/projects";
import { apolloClient } from "../utils/apollo-server"
import { teamsUsersQuery } from "./queries/teamsUsers";
import { teamsQuery } from "./queries/teams";
import { tokensQuery } from "./queries/tokens";

export const getProjects = async () => {
    const projects = await apolloClient.query({
        query: projectsQuery
    });

    return projects;
}

export const getProjectById = async ({id} : {id: string}) => {
    const projects = await apolloClient.query({
        query: projectsQuery,
        variables: {
            filter: {
                uuid: { eq: id }
            }
        }
    });
    
    return projects;
}

export const getUsersByTeamId = async ({id}: {id: string}) => {
    const users = await apolloClient.query({
        query: teamsUsersQuery,
        variables: {
            filter: {
                teams_uuid: { eq: id }
            }
        }
    });
    
    return users;
}

export const getTeamById = async ({id}: {id: string}) => {
    const teamInfo = await apolloClient.query({
        query: teamsQuery,
        variables: {
            filter: {
                uuid: { eq: id }
            }
        }
    })
    
    return teamInfo;
}

export const getTokensById = async({teams_uuid}: {teams_uuid: string}) => {
    const teamInfo = await apolloClient.query({
        query: tokensQuery,
        variables: {
            filter: {
                teams_uuid: { eq: teams_uuid }
            }
        }
    })
    
    return teamInfo.data.tokensCollection.edges;
}