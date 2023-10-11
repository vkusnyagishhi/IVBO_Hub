import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Provider } from "@/redux/provider";
import { ChakraProvider } from "@chakra-ui/react";
import { Header, Launcher } from "@/components/Common";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'IVBO-11-23 Hub',
    description: 'на описание фантазии не хватило, сори'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang='en'>
    <body className={inter.className}>
    <Provider>
        <ChakraProvider>
            <Launcher />
            <Header />

            <main style={{ width: '100%', minHeight: '96vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '50px 0px' }}>
                {children}
            </main>
        </ChakraProvider>
    </Provider>
    </body>
    </html>
}
