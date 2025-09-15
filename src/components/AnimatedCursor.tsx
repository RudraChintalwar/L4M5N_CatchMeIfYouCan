// Add this to your layout or a separate component
'use client';

import { useEffect } from 'react';

export function AnimatedCursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const cursor = document.getElementById('cursor-follower');
    if (!cursor) return;

    cursor.style.display = 'block';
    
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    document.addEventListener('mousemove', moveCursor);
    
    return () => {
      document.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return null;
}