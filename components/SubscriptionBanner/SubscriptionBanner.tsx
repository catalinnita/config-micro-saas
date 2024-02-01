import ManageSubscriptionButton from "@/app/account/ManageSubscriptionButton";
import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { Session } from '@supabase/supabase-js';
import { SubscriptionWithProduct } from "@/types/subscription";

type SubscriptionBannerProps = {
    subscription: SubscriptionWithProduct | null,
    session: Session
}

export function SubscriptionBanner({
    subscription,
    session
}: SubscriptionBannerProps) {
    if (!subscription) {
        return null
    }

    const canManage = subscription.user_id === session.user.id
  
    const subscriptionPrice =
      subscription &&
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: subscription?.prices?.currency!,
        minimumFractionDigits: 0
      }).format((subscription?.prices?.unit_amount || 0) / 100);

    return (
        <Flex justifyContent="space-around">
            <Box
                mb={6}
            >
                {subscription ? 
                <Flex
                    alignItems="center"
                >
                    <Box>You are currently on the {subscription?.prices?.products?.name} plan. {subscriptionPrice}/{subscription?.prices?.interval}</Box>
                    {canManage && <ManageSubscriptionButton session={session} />}
                </Flex>
                : 
                <Flex
                    alignItems="center"
                >
                    <Box>You are not currently subscribed to any plan.</Box>
                    <Link 
                        href="/pricing"
                    >Choose your plan</Link>
                </Flex>}
            </Box>
        </Flex>
    )
}