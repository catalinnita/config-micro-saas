import { Container, Flex } from "@chakra-ui/react";
import { getSubscription, getUser } from "@/data/supabase-server";
import { redirect } from "next/navigation";
import ManageSubscriptionButton from "../account/ManageSubscriptionButton";

async function PaymentRequiredPage() {
    const { session, userDetails, userTeams } = await getUser();

    if (!session) {
        return redirect('/signin')
    }

    const subscription = await getSubscription({
        teams_uuid: userTeams?.teams_uuid || ''
    })

    if (subscription && ( subscription.status === 'active' || subscription.status !== 'trialing')) {
        return redirect('/dashboard')
    }

    const canManage = subscription?.user_id === session.user.id
    const isAdmin = userTeams?.role

    const showManage = subscription && canManage
    const showMessage = (subscription && !canManage) || (!subscription && !isAdmin)

    if (!subscription && userTeams?.role === 'admin') {
        return redirect('/pricing')
    }

    return (
        <Flex
            alignItems="center"
            height="100vh"
        >
            <Container
                maxW="container.xs"
            >
                {showMessage && 'Your subscription is not valid please contact your administrator'}
                {showManage && <>
                    Your subscription is not valid please
                    <ManageSubscriptionButton session={session} />
                </>}
            </Container>
        </Flex>
    )
}

export default PaymentRequiredPage