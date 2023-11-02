import './globals.css';
import { Providers } from "./providers";
import { Header, Launcher } from "@/components/Common";
import type { Metadata as RawMetadata } from "next";

interface Metadata extends RawMetadata {
    'application-name': string;
}

export const metadata: Metadata = {
    'application-name': 'IVBO-11-23 Hub',
    description: 'на описание фантазии не хватило, сори',
    manifest: '/manifest.json',
    title: 'IVBO-11-23 Hub'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <html lang='en'>
    <body>
    <Providers>
        <Launcher />
        <Header />

        <main style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '75vh', width: '100%' }}>
            {children}
        </main>
    </Providers>
    </body>
    </html>
}
