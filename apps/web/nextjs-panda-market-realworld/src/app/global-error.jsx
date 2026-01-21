'use client'
/** @see https://nextjs.org/docs/pages/building-your-application/routing/custom-error */
/** @see https://nextjs.org/docs/app/getting-started/error-handling#global-errors */
// next.js내장 에러객체
import NextError from 'next/error'

export default function GlobalError() {
  // <sentry>

  return (
    <html lang='ko'>
      <body>
        {/* 
          원래 상태 에러관련 프롭을 받아야 하지만 
          임시로 0이라는 값을줘서 일반적인 오류가 발생했다는 메시지라도
          최종적으로 사용자에게 보여준다.
        */}
        <NextError statusCode={0} />
      </body>
    </html>
  )
}