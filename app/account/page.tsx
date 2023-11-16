import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getSubscription,
  getUser
} from '@/data/supabase-server';
import { Database } from '@/types/db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AdminWrapper } from '@/components/AdminWrapper';
import { Box, Heading, Button, Flex, Input } from '@chakra-ui/react';

export default async function Account() {
  const [{ session, userDetails }, subscription] = await Promise.all([
    getUser(),
    getSubscription()
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    const { error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user?.id || '');
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      console.log(error);
    }
    revalidatePath('/account');
  };

  return (
    <AdminWrapper>
      
      <Heading
        fontFamily="system-ui, helvetica"
         fontSize="3xl"
         lineHeight="none"
         fontWeight="bold"
         py={2}
      >
        Account
      </Heading>
      <Box
        mb={4}
      >
        {subscription ? 
          <Flex
            alignItems="center"
          >
            <Box>You are currently on the {subscription?.prices?.products?.name} plan. {subscriptionPrice}/{subscription?.prices?.interval}</Box>
            <ManageSubscriptionButton session={session} />
          </Flex>
          : 
          <Flex
            alignItems="center"
          >
            <Box>You are not currently subscribed to any plan.</Box>
            <Link href="/">Choose your plan</Link>
          </Flex>}
      </Box>

      <Flex
        flexDirection="column" 
        alignItems="flex-start" 
        bg="white"
        borderRadius={10}
        p={3}
        mb={4}
      >
          <Box
            fontFamily="system-ui, helvetica"
            fontSize="xl"
            lineHeight="none"
            fontWeight="bold"
            py={2}
          >Your Name</Box>
          <Box
            fontFamily="system-ui, helvetica"
            fontSize="sm"
            lineHeight="none"
            fontWeight="medium"
            py={2}
          >Please enter your full name, or a display name you are comfortable with.</Box>

          <form id="nameForm" action={updateName}>
            <Input
              width="300px"
              type="text"
              name="name"
              className="w-1/2 p-3 rounded-md bg-zinc-800"
              defaultValue={userDetails?.full_name ?? ''}
              placeholder="Your name"
              maxLength={64}
            />
          </form>

          <Box
            fontFamily="system-ui, helvetica"
            fontSize="xs"
            lineHeight="none"
            fontWeight="normal"
            py={2}
          >64 characters maximum</Box>
          <Button
            colorScheme="purple"
            size="sm"
            type="submit"
            form="nameForm"
          >
            Update Name
          </Button>
      </Flex>

      <Flex 
        flexDirection="column" 
        alignItems="flex-start" 
        bg="white"
        borderRadius={10}
        p={3}
        mb={4}
      >
          <Box
            fontFamily="system-ui, helvetica"
            fontSize="xl"
            lineHeight="none"
            fontWeight="bold"
            py={2}
          >Your Email</Box>
          <Box
            fontFamily="system-ui, helvetica"
            fontSize="sm"
            lineHeight="none"
            fontWeight="medium"
            py={2}
          >Please enter the email address you want to use to login.</Box>

          <form id="emailForm" action={updateEmail}>
            <Input
              width="300px"
              type="text"
              name="email"
              className="w-1/2 p-3 rounded-md bg-zinc-800"
              defaultValue={user ? user.email : ''}
              placeholder="Your email"
              maxLength={64}
            />
          </form>

          <Box
            fontFamily="system-ui, helvetica"
            fontSize="xs"
            lineHeight="none"
            fontWeight="normal"
            py={2}
          >We will email you to verify the change.</Box>
          <Button
            colorScheme="purple"
            size="sm"
            type="submit"
            form="emailForm"
          >
            Update Email
          </Button>
      </Flex>        
    </AdminWrapper>
  );
}
