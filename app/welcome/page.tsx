import { Container, Flex } from "@chakra-ui/react";

import { Page } from "@/types/page";
import { NameForm } from "./nameForm";
import { getUser } from "@/data/supabase-server";
import { redirect } from "next/navigation";

async function WelcomePage() {
    const { session, userDetails } = await getUser();

    if (!session) {
        return redirect('/signin')
    }

    if (userDetails?.full_name) {
        return redirect('/dashboard')
    }

    return (
        <Flex
            alignItems="center"
            height="100vh"
        >
            <Container
                maxW="container.xs"
            >
                <NameForm 
                    userId={session.user.id}
                />
            </Container>
        </Flex>
    )
}

export default WelcomePage