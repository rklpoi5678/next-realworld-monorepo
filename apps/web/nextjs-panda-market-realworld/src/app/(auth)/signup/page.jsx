import { signupMetadata } from "#/config/metadata"

import SignupView from "./_components/signup-view"

export default function SignUpPage() {
  return (
    <main className="container mx-auto max-w-160 min-h-screen">
      <SignupView />
    </main>
  )
}


export const metadata = { ...signupMetadata }