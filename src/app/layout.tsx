import { Header, Providers } from '@/components';
import { Toaster } from '@/components/ui/Toaster';
import { cn } from '@/lib';
import '@/styles/globals.css';
import { Inter, Manrope } from 'next/font/google'
import { Metadata } from 'next/types'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LiteCart',
  description: 'An e-commerce website built with Next.js, Tailwind CSS, Server Components, and Server Actions.',
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Mongo DB",
    "Stripe",
    "LiteCart",
    "E-commerce",
    "Shadcn UI",
  ],
  icons: {
    icon: [
      '/icon.ico',
      '/box.png'
    ]
  },
  authors: [
    {
      name: "Shreyas",
      url: "https://github.com/Shreyas-29",
    },
  ],
  creator: "Shreyas"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="shortcut icon" href="box.png" type="image/x-icon" />
      <body className={cn(inter.className, 'bg-white text-base text-neutral-900 relative body scrollbar-hide')}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
