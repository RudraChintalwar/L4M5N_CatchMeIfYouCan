"use client";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      router.push("/"); // send to home page
    }
  }, [user, router]);

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success("Signed in!");
      // router.push("/") will also work here,
      // but useEffect covers auto-redirect too
    } catch (e) {
      console.error(e);
      toast.error("Sign in failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Checking authentication...
      </div>
    );
  }

  // If already logged in, don't show login button
  if (user) return null;

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6">Smart To-Do</h1>
        <button
          onClick={loginGoogle}
          className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
