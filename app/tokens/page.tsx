import { getUser } from '@/data/supabase-server';
import { AdminWrapper } from '@/components/AdminWrapper';
import { getTokensById } from '@/data/apollo-server';
import { GridWrapper } from '@/components/GridWrapper';
import { TokensList } from './tokensList';
import { Page } from '@/types/page';

async function TokensPage({
  params
}: { params: Page }) {
    const { userTeams } = params
    
    if (!userTeams?.teams_uuid) {
        return <></>
    }

    const tokens = await getTokensById({
        teams_uuid: userTeams?.teams_uuid
    })
    const rowsCount = tokens?.length

    return (
      <GridWrapper rows={rowsCount}>
          <div></div>
          <TokensList 
              initialTokens={tokens}
              teams_uuid={userTeams?.teams_uuid}
          />
      </GridWrapper>
    )
  
}

export default AdminWrapper(TokensPage)