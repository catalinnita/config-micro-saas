import { Box, Flex } from "@chakra-ui/react";

type SubscriptionBannerProps = {
    status: string
    id: string
}

export function SubscriptionBanner({
    status,
    id
}: SubscriptionBannerProps) {
    return (
        <Flex>
            <Box>{id}</Box>
            <Box>{status}</Box>
        </Flex>
    )
}