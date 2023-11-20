import Navbar from "../Navbar";
import { Container } from "@chakra-ui/react";
import { navigationItems } from "@/config/navigation";
import { getSubscription, getUser } from "@/data/supabase-server";
import { redirect } from "next/navigation";
import { Page } from "@/types/page";

export function AdminWrapper<T extends { params: Page }>(
    Page: (props: T) => Promise<JSX.Element> | JSX.Element
) {
    return async (props: T): Promise<JSX.Element> => {
        const { session, userDetails, userTeams } = await getUser();
        console.log({props})
        if (!session) {
            return redirect('/signin');
        }

        if (!userDetails?.full_name) {
            return redirect('/welcome')
        }

        const subscription = await getSubscription()
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
                    <Page 
                        {...props} 
                    />
                </Container>
            </Container>
        )
    }
}