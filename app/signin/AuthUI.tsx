'use client';

import { useSupabase } from '@/providers/supabase-provider';
import { chakraTheme } from '@/styles/chakra-theme';
import { getURL } from '@/utils/helpers';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthUI() {
  const { supabase } = useSupabase();
  console.log({
    url: getURL()
  })
  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['github']}
        redirectTo={`${getURL()}/auth/callback`}
        magicLink={true}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: chakraTheme.colors.purple[600],
                brandAccent: chakraTheme.colors.purple[700],
                inputBackground: chakraTheme.colors.gray[50],
                inputBorder: chakraTheme.colors.gray[300],
                inputBorderFocus: chakraTheme.colors.purple[600],
                inputBorderHover: chakraTheme.colors.gray[400],
                inputLabelText: chakraTheme.colors.gray[900],
                inputPlaceholder: chakraTheme.colors.gray[600],
                
                defaultButtonBackground: chakraTheme.colors.white,
                defaultButtonBackgroundHover: chakraTheme.colors.gray[50],

                defaultButtonBorder: chakraTheme.colors.gray[300],
                defaultButtonText: chakraTheme.colors.gray[900],
              },
              fonts: {
                bodyFontFamily: chakraTheme.fonts.body,
                buttonFontFamily: chakraTheme.fonts.body,
                inputFontFamily: chakraTheme.fonts.body,
                labelFontFamily: chakraTheme.fonts.body,
              },
              fontSizes: {
                baseBodySize: chakraTheme.fontSizes.md,
                baseInputSize: chakraTheme.fontSizes.md,
                baseLabelSize: chakraTheme.fontSizes.md,
                baseButtonSize: chakraTheme.fontSizes.md,
              },
              radii: {
                borderRadiusButton: chakraTheme.radii.lg,
                buttonBorderRadius: chakraTheme.radii.lg,
                inputBorderRadius: chakraTheme.radii.lg,
              }
            }
          }
        }}
      />
    </div>
  );
}
