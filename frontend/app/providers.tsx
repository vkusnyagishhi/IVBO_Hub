'use client';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, createMultiStyleConfigHelpers, extendTheme } from '@chakra-ui/react';
import { Provider } from "@/redux/provider";
import '@fontsource-variable/manrope';
import { switchAnatomy } from "@chakra-ui/anatomy";

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(switchAnatomy.keys);

export function Providers({ children }: { children: React.ReactNode }) {
    return <Provider>
        <CacheProvider>
            <ChakraProvider theme={extendTheme({
                fonts: {
                    body: `'Manrope Variable', sans-serif`,
                    heading: `'Manrope Variable', sans-serif`,
                },
                colors: {
                    main: {
                        100: '#102334',
                        200: '#141414' // '#0c1b28'
                    }
                },
                components: {
                    Switch: defineMultiStyleConfig({
                        baseStyle: definePartsStyle({
                            track: {
                                bg: 'gray.700',
                                _checked: {
                                    bg: 'blue.600'
                                }
                            }
                        })
                    })
                }
            })}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    </Provider>
}