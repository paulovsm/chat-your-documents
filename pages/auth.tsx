import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

import styles from '../styles/auth.module.css';

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      alert("The email is not in the whitelist.");
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
