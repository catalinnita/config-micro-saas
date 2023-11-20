import { AdminWrapper } from '@/components/AdminWrapper';
import { Page } from "@/types/page";
import { GridWrapper } from "@/components/GridWrapper";
import { TeamInfo } from "./teamInfo";
import { TeamUsers } from "./teamUsers";
import { getTeamById, getUsersByTeamId } from "@/data/apollo-server";

async function TeamsPage({
    params
}: { params: Page }) {
  console.log({params})  
  const { userTeams } = params;
  const { teams_uuid } = userTeams

    if (!teams_uuid) {
        return <></>
    }
    
    const [teamInfo, users] = await Promise.all([
        getTeamById({
            id: teams_uuid
        }),
        getUsersByTeamId({
            id: teams_uuid
        }),
    ])

    return (
        <GridWrapper rows={2}>
            <div></div>
            <TeamInfo 
                teams_uuid={teamInfo.data.teamsCollection.edges[0].node.uuid}
                name={teamInfo.data.teamsCollection.edges[0].node.name}
                description={teamInfo.data.teamsCollection.edges[0].node.description}
            />
            <div></div>
            <TeamUsers 
                teamUuid={teams_uuid}
                users={users.data.teams_usersCollection.edges}
            />
        </GridWrapper>
    )
}

export default AdminWrapper(TeamsPage)