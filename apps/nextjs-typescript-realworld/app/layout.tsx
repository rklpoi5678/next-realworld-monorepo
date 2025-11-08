import "./globals.css";

import { Roboto } from 'next/font/google';

import { rootMetadata } from "#/configs/root-metadata";
import { API_ENDPOINTS } from "#/constant/api";
import SWRProvider from "#/libs/swr/swr-provider";

const roboto = Roboto({
  weight: ["400", "500", "700"],    // 필요한 굵기(Array)
  subsets: ["latin"],               // 사용할 문자 세트
  display: "swap",                  // 폰트 로딩 전략
  variable: "--font-roboto",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userResponse = { user: null }

  const fallback = {
    [API_ENDPOINTS.CURRENT_USER]: userResponse
  }
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
            try {
              var mode = localstorage.getItem('dark-mode'); 
              if (mode) {
                var parsed = JSON.parse(mode); 
                if (parsed.state && parsed.state.isDark) {
                  document.documentElement.classList.add('dark'); 
                } else {
                  document.documentElement.classList.remove('dark');   
                }
              } else {
                // system setting check
                if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
                  document.documentElement.classList.add('dark'); 
                }
              }
            } catch (e) {
              console.error('다크 모드 초기화 오류:', e);  
            }
           })();
          `,
          }}
        />
        <body
          className={`${roboto.variable} antialiased`} // suppressHydrationWarning: 하이드레이션 미스매치 무시인데 현재 사용 x
        >
          <SWRProvider fallback={fallback}>
            {children}
          </SWRProvider>
        </body>
      </head>
    </html>
  );
}

export const metadata = { ...rootMetadata }
