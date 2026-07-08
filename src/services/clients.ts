import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getClients = async () => {
  const querySnapshot = await getDocs(collection(db, "clients"));

  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
