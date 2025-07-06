import './globals.css'
import Providers from './providers'
import Header from '@/components/Header'

export const metadata = {
  title: 'My App',
  description: 'QR Code Project'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
 