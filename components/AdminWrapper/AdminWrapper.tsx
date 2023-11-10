import { ReactNode } from "react";
import { Container } from "@chakra-ui/react";
import Navbar from "../Navbar";
import { navigationItems } from "@/config/navigation";

type AdminWrapperProps = {
    children: ReactNode
}

export function AdminWrapper({
    children
}: AdminWrapperProps) {
    return (
        <Container 
            p={0}
            minH="100vh"
            maxW="100%" 
            bg="#eeeeee"
        >
            <Navbar sections={navigationItems} />
            <Container maxW="container.xl">
                {children}
            </Container>
        </Container>
    )
}