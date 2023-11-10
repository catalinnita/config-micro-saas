import NextLink from 'next/link'
import { Link, Container, Flex, Grid } from '@chakra-ui/react';
import { createServerSupabaseClient } from '@/data/supabase-server';

import SignOutButton from './SignOutButton';
import { NavigationItem } from '@/config/navigation';
import { chakraTheme } from '@/styles/chakra-theme';

type NavbarProps = {
  sections: NavigationItem[]
}

export default async function Navbar({
  sections
}: NavbarProps) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <Container maxW="100%" bg={chakraTheme.colors.blackAlpha['300']} mb={6}>
      <Container maxW="container.xl">
        <Grid 
          as="nav"
          gridTemplateColumns="0fr 1fr auto"
          alignItems="center"
        >

            <Link 
              fontFamily="system-ui, helvetica"
              fontSize="md"
              letterSpacing="-0.05em"
              fontWeight="bold"
              variant="text"
              padding={6}
              as={NextLink} 
              href="/" 
              aria-label="Logo"
            >
              L
            </Link>
            
            <Flex as="nav">
              {user && sections.map(navItem => (
                <Link 
                  fontFamily="system-ui, helvetica"
                  fontSize="md"
                  letterSpacing="-0.05em"
                  fontWeight="normal"
                  variant="text"
                  as={NextLink} 
                  key={navItem.label} 
                  href={navItem.link}
                  padding={6}
                  display="block"
                >
                  {navItem.label}
                </Link>
              ))}
            </Flex>

          
            {user ? (
              <SignOutButton />
            ) : (
              <Link 
                as={NextLink} 
                href="/signin"
              >
                Sign in
              </Link>
            )}
        </Grid>
      </Container>
    </Container>
  );
}
