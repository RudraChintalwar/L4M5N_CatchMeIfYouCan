// components/Auth.tsx
"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useEffect } from "react";
import toast from "react-hot-toast";

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

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Auth error</div>;

  return user ? (
    <div className="flex items-center gap-3">
      <img src={user.photoURL ?? ""} className="w-8 h-8 rounded-full" alt="avatar" />
      <span className="text-sm">{user.displayName}</span>
      <button className="ml-2 px-3 py-1 rounded bg-red-500 text-white" onClick={() => signOut(auth)}>Sign out</button>
    </div>
  ) : (
    <button className="px-4 py-2 rounded bg-indigo-600 text-white" onClick={loginGoogle}>Sign in with Google</button>
  );
}
