import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { firestore } from '../firebase'; // Import Firestore

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {

          const userDoc = await firestore.collection('users').doc(user.uid).get();
          console.log(userDoc.data());
          if (userDoc.exists) {
            setUser(userDoc.data());
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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};