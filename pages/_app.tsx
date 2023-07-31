import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  if (!isAuthenticated && router.pathname !== '/auth') {
    router.push('/auth');
    return null;
  }

  return <Component {...pageProps} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
}
