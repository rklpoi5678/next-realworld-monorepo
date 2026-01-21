import { loginMetadata } from '#/config/metadata';

import LoginView from './_components/login-view';

export default function LoginPage() {
  return (
    <main className='container mx-auto max-w-160 min-h-screen'>
      <LoginView />
    </main>
  );
}


export const metadata = { ...loginMetadata }