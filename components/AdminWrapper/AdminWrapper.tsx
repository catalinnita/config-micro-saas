import Navbar from "../Navbar";
import { Container } from "@chakra-ui/react";
import { navigationItems } from "@/config/navigation";
import { getSubscription, getUser } from "@/data/supabase-server";
import { redirect } from "next/navigation";
import { Page } from "@/types/page";
import { SubscriptionBanner} from "@/components/SubscriptionBanner";

export function AdminWrapper<T extends { params: Page }>(
    Page: (props: T) => Promise<JSX.Element> | JSX.Element
) {
    return async (props: T): Promise<JSX.Element> => {
        const { session, userDetails, userTeams } = await getUser();

        if (!session) {
            return redirect('/signin')
        }
        
        if (!userDetails?.full_name || userDetails?.full_name.includes("@")) {
            return redirect('/welcome')
        }
        
        const subscription = await getSubscription({
            teams_uuid: userTeams?.teams_uuid || ''
        })

        if (!subscription && userTeams?.role === 'admin') {
            return redirect('/pricing')
        }
        
        if (!subscription && userTeams?.role !== 'admin') {
            return redirect('/payment-required')
        }

        if (subscription && subscription.status !== 'active' && subscription.status !== 'trialing') { 
            return redirect('/payment-required')
        }
                
        props = {
            ...props,
            params: {
                ...props.params,
                session,
                userDetails,
                userTeams,
                subscription
            }
        }
        return (
            <Container 
                p={0}
                minH="100vh"
                maxW="100%" 
                bg="#eeeeee"
            >
                <Navbar sections={navigationItems} />
                <Container maxW="container.xl">
                    <SubscriptionBanner 
                        subscription={subscription}
                        session={session}
                    />
                    <Page 
                        {...props} 
                    />
                </Container>
            </Container>
        )
    }
}