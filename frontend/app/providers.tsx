'use client';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { Provider } from "@/redux/provider";
import '@fontsource-variable/inter';

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider>
        <CacheProvider>
                <ChakraProvider theme={extendTheme({
                    fonts: {
                        body: `'Inter Variable', sans-serif`,
                        heading: `'Inter Variable', sans-serif`,
                    }
                })}>
                    {children}
                </ChakraProvider>
        </CacheProvider>
    </Provider>
}