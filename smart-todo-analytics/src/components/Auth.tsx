// components/Auth.tsx
"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function AuthActions() {
  const [user, loading, error] = useAuthState(auth);

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Signed in!");
    } catch (e) {
      toast.error("Sign in failed");
      console.error(e);
    }
  };

  if (loading) return (
    <div className="p-4">
      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (error) return <div className="p-4 text-red-400">Auth error</div>;

  return user ? (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <motion.img 
        whileHover={{ scale: 1.1 }}
        src={user.photoURL ?? ""} 
        className="w-8 h-8 rounded-full border-2 border-purple-500" 
        alt="avatar" 
      />
      <span className="text-sm text-white">{user.displayName}</span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="ml-2 px-3 py-1 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white text-sm"
        onClick={() => signOut(auth)}
      >
        Sign out
      </motion.button>
    </motion.div>
  ) : (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center gap-2"
      onClick={loginGoogle}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
      Sign in with Google
    </motion.button>
  );
}