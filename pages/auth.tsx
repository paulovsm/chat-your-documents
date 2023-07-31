import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Auth() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { data, error } = await supabase
      .from('whitelisted_emails')
      .select('email')
      .eq('email', email);

    if (error) {
      console.error(error);
      return;
    }

    if (data.length > 0) {
      // The email is in the whitelist.
      // Here you can set the authentication state.
    } else {
      // The email is not in the whitelist.
      // Show an error message.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
