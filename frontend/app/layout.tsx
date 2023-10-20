import './globals.css';
import { Providers } from "./providers";
import { Text } from "@chakra-ui/react";
import { Header, Launcher } from "@/components/Common";
import type { Metadata as RawMetadata } from "next";

interface Metadata extends RawMetadata {
    'application-name': string;
}

export const metadata: Metadata = {
    title: 'IVBO-11-23 Hub',
    description: 'на описание фантазии не хватило, сори',
    'application-name': 'IVBO-11-23 Hub',
    manifest: '/manifest.json'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang='en'>
    <body>
    <Providers>
            <Launcher />
            <Header />

            <main style={{ width: '100%', minHeight: '96vh', padding: '50px 0px 160px 0px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </main>
    </Providers>
    </body>
    </html>
}
