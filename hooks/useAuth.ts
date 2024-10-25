// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, database } from '@/lib/firebase/config';
import { User } from '@/lib/db/schema';
import { useQuery } from '@tanstack/react-query';

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const fetchUserData = async (uid: string) => {
    const userDocRef = doc(database, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  };

  const {
    data: userData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['userData', user?.uid],
    queryFn: () => fetchUserData(user!.uid),
    enabled: !!user,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return { user, userData, loading: isLoading, refetch };
}
