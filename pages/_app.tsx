import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      const authenticated = localStorage.getItem('isAuthenticated') === 'true';
      console.log('Checking if user is authenticated:' + authenticated);

      return authenticated;
    }
    return false;
  });

  let router;
  if (typeof window !== 'undefined') {
    router = useRouter();
  }

  //console.log(router, isAuthenticated);

  if (router && !isAuthenticated && router?.pathname !== '/auth') {
    //console.log('Redirecting to /auth');
    router.replace('/auth');
    return null;
  } 

  if (router && (isAuthenticated || router?.pathname === '/auth')) {
    //console.log('Rendering app');
    return <Component {...pageProps} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
  }

  return null;

}
