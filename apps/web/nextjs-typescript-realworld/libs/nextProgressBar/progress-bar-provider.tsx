"use client"

// App router 용
import { AppProgressProvider } from "@bprogress/next"

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProgressProvider
      height="2px"
      color="#5cb85c"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </AppProgressProvider>
  )
}

export default Providers