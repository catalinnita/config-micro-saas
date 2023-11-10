import { getTeamById, getUsersByTeamId } from "@/data/apollo-server"
import { TeamInfo } from "@/app/teams/teamInfo"
import { TeamUsers } from "./teamUsers"
import { GridWrapper } from "@/components/GridWrapper"

type TeamProps = {
    teams_uuid: string,
}

export async function Team({
    teams_uuid
}: TeamProps) {
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