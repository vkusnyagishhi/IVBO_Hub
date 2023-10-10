import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from "@/redux/provider";
import { ChakraProvider } from "@chakra-ui/react";
import { Launcher } from "@/components/Common";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
    return <html lang='en'>
    <body className={inter.className}>
    <Provider>
        <ChakraProvider>
            <Launcher />
            {children}
        </ChakraProvider>
    </Provider>
    </body>
    </html>
}
