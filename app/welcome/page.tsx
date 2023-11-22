import { Container, Flex } from "@chakra-ui/react";

import { Page } from "@/types/page";
import { AdminWrapper } from "@/components/AdminWrapper";
import { NameForm } from "./nameForm";

function WelcomePage({
    params
}: { params: Page }) {
    return (
        <Flex
            alignItems="center"
            height="100vh"
        >
            <Container
                maxW="container.xs"
            >
                <NameForm />
            </Container>
        </Flex>
    )
}

export default AdminWrapper(WelcomePage)