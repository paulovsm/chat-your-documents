import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import { authService } from '../src/auth/authService';
import Link from 'next/link';
import { useSession } from '../src/auth/session';
import { CircularProgress } from '@mui/material';

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const appTitle = process.env.NEXT_PUBLIC_APP_NAME;

  useEffect(() => {
    if (session.data.session) {
      router.push('/chat');
    }
  }, [session.data.session]);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);

    authService
      .login({
        username: email,
      })
      .then(() => {
        router.push('/chat');
      })
      .catch((err) => {
        console.log(err);
        setLoginMessage('This email is not allowed to access this application.')
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className={styles.topnav}>
        <div className={styles.navlogo}>
          <Link href="/">{appTitle}</Link>
        </div>
      </div>
      <main className={styles.mainlogin}>
        <div className={styles.cloudlogin}>
          <div className={styles.messagelist}>
            <div className={styles.titlelogin}>
              Sign In to {appTitle}
            </div>
            <div className={styles.centerlogin} >
              <div className={styles.appdescription}>
                Please enter your email address to continue.
              </div>
              <div className={styles.cloudform}>
                <form onSubmit={handleLogin} >
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={styles.textinput} placeholder='Email address' />
                  <button type="submit" className={styles.loginbutton}>{loading ? (
                    <div className={styles.loadingwheel}>
                      <CircularProgress color="inherit" size={20} />
                    </div>
                  ) : (
                    <span> Sign In </span>
                  )}
                  </button>
                </form>
              </div>
              <div className={styles.errormessage}>
                {loginMessage}
              </div>
            </div>
          </div>
        </div>

      </main>

    </>
  );
}
