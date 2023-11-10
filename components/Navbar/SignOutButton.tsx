'use client';

import { useSupabase } from '@/providers/supabase-provider';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  return (
    <Button
      fontFamily="system-ui, helvetica"
      fontSize="md"
      letterSpacing="-0.05em"
      fontWeight="normal"
      variant="text"
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/signin');
      }}
    >
      Sign out
    </Button>
  );
}
