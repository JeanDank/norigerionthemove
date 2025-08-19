import React, { useEffect } from 'react';
import { signInWithGoogle, signOutUser, subscribeToAuth } from '../firebase';
import { useTripStore } from '../store';

export default function AuthBar() {
  const { user, setUser } = useTripStore();

  useEffect(() => {
    const unsub = subscribeToAuth((u) => setUser(u));
    return () => unsub();
  }, [setUser]);

  return (
    <div>
      {user ? (
        <button onClick={signOutUser}>Sign out</button>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
}


