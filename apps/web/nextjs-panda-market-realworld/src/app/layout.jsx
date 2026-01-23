/* + #은 jsconfig설정에 의해 최상위 루트를 가리키게된다. */
import './globals.css'

import Pretendard from 'next/font/local'
import Rokaf from 'next/font/local'

import { GlobalDialog } from '@/components/ui/dialog/global-dialog'
import { rootMetadata } from '#/config/metadata'

import { Providers } from './providers'

const pretendard = Pretendard({
  src: '../assets/font/PretendardVariable.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-pretendard',
})

const rokaf = Rokaf({
  src: '../assets/font/ROKAF Sans Medium.woff2',
  display: 'swap',
  weight: '100 900',
  variable: '--font-rokaf',
})

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} ${rokaf.variable} antialiased`}>
        <Providers>
          {children}
          <GlobalDialog />
        </Providers>
      </body>
    </html>
  )
}

export const metadata = { ...rootMetadata }
