import Pricing from '@/components/Pricing/Pricing';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices,
  getUser
} from '@/data/supabase-server';

export default async function PricingPage() {
  const { session, userTeams } = await getUser();
  const products = await getActiveProductsWithPrices();

  const subscription = await getSubscription({
      teams_uuid: userTeams?.teams_uuid || ''
  })

  return (
    <Pricing
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
  );
}
