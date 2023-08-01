import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import styles from '../styles/auth.module.css';

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  // // Check if the user is already authenticated.
  // useEffect(() => {
  //   if (localStorage.getItem('isAuthenticated') === 'true' && router.pathname !== '/') {
  //     //console.log('Redirecting to /');
  //     window.location.href = '/';
  //   }
  // }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('whitelisted_emails')
      .select('email')
      .eq('email', email)
      .is('enabled', true);

    if (error) {
      console.error(error);
      return;
    }

    if (data.length > 0) {
      // The email is in the whitelist.
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/');
    } else {
      // The email is not in the whitelist.
      alert("Sorry, you're not allowed to access this page.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        Email:
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} />
      </label>
      <button type="submit" className={styles.button}>Submit</button>
    </form>
  );
}
