'use client'

import { chakraTheme } from '@/styles/chakra-theme'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const theme = extendTheme(chakraTheme)

type ChakraProviderWithThemeProps = {
    children: ReactNode
}

export function ChakraProviderWithTheme({
    children
}: ChakraProviderWithThemeProps) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}