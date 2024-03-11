"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {

  const resolvedTheme = useTheme();
  // console.log(config.theme.extend.colors.primary.DEFAULT)

  const themeSelected = resolvedTheme.theme === "dark" || (resolvedTheme.theme === "system" && resolvedTheme.systemTheme !== "light") ? dark : undefined

  // console.log(resolvedTheme.theme, /* === "system" && */ resolvedTheme.systemTheme /* !== "light" */)

  if (resolvedTheme === undefined) throw Error()

  return (
    <ConvexProvider client={convex}>
      <ClerkProvider
        appearance={{
          baseTheme: themeSelected,
          // variables: { colorPrimary: `${fullConfig.theme.colors.primary.DEFAULT}`, colorTextOnPrimaryBackground: `${fullConfig.theme.colors.primary.foreground}`}
          // variables: { colorPrimary: 'hsl(210 40% 98%)'}
        }}
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ConvexProvider>
  )
}