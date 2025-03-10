import React, { createContext, useState, useEffect } from 'react';
import { auth, firestore } from '../firebase'; // Import Firestore
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp } from "firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const reviewsRef = collection(firestore, "reviews");
            const q = query(reviewsRef, where("userId", "==", user.uid));
            const unsubscribeReviews = onSnapshot(q, (snapshot) => {
              const reviews = snapshot.docs.map((doc) => doc.data());
              setUser({ ...userData, reviews, isAdmin: userData.isAdmin });
            });

            // Set user status to online
            await updateDoc(doc(firestore, 'users', user.uid), {
              isOnline: true,
              lastSeen: serverTimestamp(),
            });

            return () => unsubscribeReviews();
          } else {
            setUser(null);
          }
        } catch (error) {
          console.log(error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    if (user) {
      // Update last seen when user signs out
      await updateDoc(doc(firestore, 'users', user.uid), {
        isOnline: false,
        lastSeen: serverTimestamp(),
      });
    }
    auth.signOut();
  };

  return (
    <UserContext.Provider value={{ user, setUser, handleLogout }}>
      {children}
    </UserContext.Provider>
  );
};