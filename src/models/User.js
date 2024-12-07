
import { getFirestore, doc, setDoc } from 'firebase/firestore';

class User {
  constructor(uid, name, email, gender) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.gender = gender;
  }

  async uploadToFirestore() {
    const db = getFirestore();
    try {
        console.log(this.name);
      await setDoc(doc(db, 'users', this.uid), {
        email: this.email,
        gender: this.gender,
        
      });
      console.log('User data uploaded to Firestore!');
    } catch (error) {
      console.error('Error uploading user data: ', error);
    }
  }
}

export default User;