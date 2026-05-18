import { initializeApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithRedirect, getRedirectResult
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, onSnapshot, query, 
  updateDoc, deleteDoc, getDocFromServer, enableIndexedDbPersistence 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a a time.
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.warn('Firestore persistence failed: Browser not supported');
    }
  });
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google Popup:', error);
    
    // Fallback or specific error handling
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
      // For browsers that block popups (like some Edge configs or mobile webviews)
      // we can try redirect, but usually we just want to inform the user
      // and maybe provide a button for redirect in the UI.
      throw error;
    }
    
    throw error;
  }
};

export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
};

export const signInWithEmail = (email: string, pass: string) => signInWithEmailAndPassword(auth, email, pass);
export const signUpWithEmail = (email: string, pass: string) => createUserWithEmailAndPassword(auth, email, pass);
export const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

export const signOut = () => auth.signOut();

// Error Handling helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error Detailed: ', JSON.stringify(errInfo));
  // We log it but we don't necessarily want to throw and crash the entire UI if we have offline fallbacks
  // However, the instructions say MUST throw for diagnostics. 
  // I will throw but ensure UI catches it or handles it gracefully.
  throw new Error(JSON.stringify(errInfo));
}

// Validation function as required in instructions
export async function testConnection() {
  try {
    // getDocFromServer forces a network request to verify the backend exists and is reachable
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firebase Backend Connected successfully.");
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("Firebase connected, but hit permission-denied. This is expected if 'test/connection' doesn't exist or isn't public.");
    } else if (error.message && (error.message.includes('offline') || error.message.includes('backend'))) {
      console.error("Please check your Firebase configuration or network status. Backend seems unreachable.");
    } else {
      console.error("Firebase connection test failed:", error.message);
    }
  }
}
testConnection();
