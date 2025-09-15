// src/hooks/useTasks.tsx
"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { useMemo } from "react";
import dayjs from "dayjs";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

export type Task = {
  id: string;
  userId: string;
  title: string;
  description?: string;
  importance: "High" | "Medium" | "Low" | string;
  dueAt?: Date | null;
  completed: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  completedAt?: Date | null;
};

export function useTasks() {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Task[] = snap.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          userId: data.userId,
          title: data.title,
          description: data.description ?? "",
          importance: data.importance ?? "Medium",
          dueAt:
            data.dueAt && data.dueAt.toDate ? data.dueAt.toDate() : data.dueAt ?? null,
          completed: !!data.completed,
          createdAt:
            data.createdAt && data.createdAt.toDate
              ? data.createdAt.toDate()
              : data.createdAt ?? null,
          updatedAt:
            data.updatedAt && data.updatedAt.toDate
              ? data.updatedAt.toDate()
              : data.updatedAt ?? null,
          completedAt:
            data.completedAt && data.completedAt.toDate
              ? data.completedAt.toDate()
              : data.completedAt ?? null,
        };
      });
      setTasks(list);
    });

    return () => unsub();
  }, [user]);

  // Add task. importance can be "High"|"Medium"|"Low" or a numeric slider 1..10
  const addTask = async (
    title: string,
    description: string,
    importance: string | number = "Medium",
    dueAt?: Date | null
  ) => {
    if (!user) throw new Error("Not authenticated");
    // Normalize numeric importance to High/Medium/Low
    let imp: string;
    if (typeof importance === "number") {
      if (importance >= 8) imp = "High";
      else if (importance >= 4) imp = "Medium";
      else imp = "Low";
    } else {
      imp = importance;
    }

    await addDoc(collection(db, "tasks"), {
      userId: user.uid,
      title,
      description: description ?? "",
      importance: imp,
      dueAt: dueAt ? dueAt : null,
      completed: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      completedAt: null,
    });
  };

  // Toggle completion: set completedAt when marking complete
  const toggleComplete = async (taskId: string, current: boolean) => {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: !current,
      completedAt: !current ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    });
  };

  const removeTask = async (taskId: string) => {
    await deleteDoc(doc(db, "tasks", taskId));
  };

  const updateTask = async (taskId: string, updates: Partial<any>) => {
    await updateDoc(doc(db, "tasks", taskId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const prioritizedTasks = useMemo(() => {
  const now = dayjs();
  return tasks
    .filter((t) => !t.completed) // only incomplete tasks
    .map((t) => {
      // compute urgency score
      let dueScore = 0;
      if (t.dueAt) {
        const daysUntil = dayjs(t.dueAt).diff(now, "day");
        // tasks due sooner => bigger score
        dueScore = daysUntil <= 0 ? 50 : Math.max(0, 30 - daysUntil); // max 30 points
      }
      // importance is 1–10 or 1–5 scale
      const importanceScore = Number(t.importance) * 5;
// up to 50 points
      return { ...t, score: importanceScore + dueScore };
    })
    .sort((a, b) => b.score - a.score); // higher score first
}, [tasks]);

  return { tasks, addTask, toggleComplete, removeTask, updateTask, prioritizedTasks, };
}
