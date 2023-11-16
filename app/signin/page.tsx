import { getSession } from '@/data/supabase-server';
import AuthUI from './AuthUI';

import { redirect } from 'next/navigation';
import { Box, Container, Flex } from '@chakra-ui/react';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    return redirect('/dashboard');
  }

  return (
      <Container
        maxW="container.xs"
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        h="100vh"
      >
        <Box width="100%">
          <Flex justifyContent="space-around">
            L
          </Flex>
          <AuthUI />
        </Box>
      </Container>
  );
}
