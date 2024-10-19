import type { Metadata } from 'next';
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
    title: 'notic3',
    description: 'you are notic3d.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
                {children}
            </body>
        </html>
    );
}
