import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "./../configs/firebase.config";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { generateRandomString } from "./../helpers/string.helpers";

export const uploadFile = async (
  /** @type {any} */ file,
  /** @type {string} */ eventId,
  /** @type {string} */ extension
) => {
  const randomFileName = generateRandomString(10);
  const storageRef = ref(storage, `${eventId}/${randomFileName + extension}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress events
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(storageRef);
          resolve({ url, filename: randomFileName + extension });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

export const createDocument = async (
  /** @type {string} */ collectionName,
  /** @type {any} */ data
) => {
  try {
    const userRef = collection(firestore, collectionName);
    const docRef = await addDoc(userRef, data);
    return docRef.id;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const findDocumentById = async (
  /** @type {string} */ collectionName,
  /** @type {string} */ documentId
) => {
  const docRef = doc(firestore, collectionName, documentId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    // console.log("Document data:", snap.data());
    return snap.data();
  } else {
    throw new Error("Document data not found");
  }
};

export const updateDocument = async (
  /** @type {string} */ collectionName,
  /** @type {string} */ documentId,
  /** @type {any} */ data
) => {
  const docRef = doc(firestore, collectionName, documentId);
  updateDoc(docRef, {
    data,
  })
    .then(() => {
      console.log("Document successfully updated!");
    })
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
};
export const findDocuments = async (
  /** @type {string} */ collectionName,
  /** @type {any[]} */ conditions
) => {
  console.log(conditions);
  let q = collection(firestore, collectionName);
  conditions.forEach(
    (
      /** @type {{ field: string | import("@firebase/firestore").FieldPath; operator: string; value: unknown; }} */ condition
    ) => {
      // @ts-ignore
      q = query(q, where(condition.field, condition.operator, condition.value));
    }
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    console.log("Document exists with the given conditions");
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } else {
    console.log("No such document with the given conditions");
    return null;
  }
};
