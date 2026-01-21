export default async function Home() {
  // 간단한 예제이므로 이렇게 만 작성
  // 실제 관심사 분리 및 환경변수 처리 필요
  const res = await fetch('http://backend:4000/api/hello', { cache: 'no-store' })
  const data = await res.json()

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold text-blue-600">LMS MVP Skeleton</h1>
      <p className="mt-4">
        Backend Status: <span className="font-mono">{data.message}</span>
      </p>
    </main>
  )
}
