// src/app/login/page.tsx
"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in!");
    } catch (e) {
      console.error(e);
      toast.error("Sign in failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"
      ></motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700 max-w-sm w-full text-center backdrop-blur-md"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
        >
          Smart To-Do
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-8"
        >
          Organize your tasks with AI-powered insights
        </motion.p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loginGoogle}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-3 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
          </svg>
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
}