import "./globals.css";

import { Roboto } from 'next/font/google';
import { cookies } from 'next/headers'

import { Header } from "#/components/ui/header/header";
import { rootMetadata } from "#/configs/root-metadata";
import { API_ENDPOINTS } from "#/constant/api";
import Providers from "#/libs/nextProgressBar/progress-bar-provider";
import SWRProvider from "#/libs/swr/swr-provider";

const roboto = Roboto({
  weight: ["400", "500", "700"],    // 필요한 굵기(Array)
  subsets: ["latin"],               // 사용할 문자 세트
  display: "swap",                  // 폰트 로딩 전략
  variable: "--font-roboto",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let userResponse = { user: null }

  if (token) {
    try {
      userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }).then((res) => res.json());
    } catch (error) {
      console.error(error);
      throw new Error("사용자 정보를 불러오는데 실패했습니다.")
    }
  }

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
            <Providers>
              <Header />
              <main className="dark:bg-gray-900 min-h-screen">{children}</main>
              <div id="modal-root"></div>
            </Providers>
          </SWRProvider>
        </body>
      </head>
    </html>
  );
}

export const metadata = { ...rootMetadata }
