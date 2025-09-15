// components/LandingPage.tsx
'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

// Only register plugins on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(TextPlugin);
}

export default function LandingPage() {
  const mainTitleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const demoCardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize particles with deterministic positions
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: (i * 15) % 100,
    left: (i * 23) % 100,
    size: (i % 5) * 20 + 20,
    duration: (i % 7) + 5,
    delay: (i % 3) * 2,
  }));

  // Initialize glowing orbs with deterministic positions
  const orbs = [
    { id: 1, top: 10, left: 20, size: 200, color: "from-pink-500/10 to-purple-600/10" },
    { id: 2, top: 70, left: 80, size: 150, color: "from-blue-500/10 to-cyan-500/10" },
    { id: 3, top: 40, left: 50, size: 250, color: "from-purple-500/10 to-indigo-600/10" },
    { id: 4, top: 80, left: 10, size: 180, color: "from-pink-500/10 to-purple-600/10" },
    { id: 5, top: 20, left: 70, size: 220, color: "from-blue-500/10 to-cyan-500/10" },
  ];

  useEffect(() => {
    setIsMounted(true);
    
    const ctx = gsap.context(() => {
      // Animate main title with text effect
      if (mainTitleRef.current) {
        gsap.to(mainTitleRef.current, {
          text: {
            value: "AetherList",
            speed: 1.5,
            delimiter: "",
          },
          duration: 2,
          ease: "power2.inOut",
        });
      }

      // Animate subtitle
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.5, delay: 1.2 }
        );
      }

      // Animate CTA buttons with stagger
      gsap.fromTo(".cta-button",
        { opacity: 0, y: 30, scale: 0.8 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 1, 
          delay: 1.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        }
      );

      // Animate demo card
      if (demoCardRef.current) {
        gsap.fromTo(demoCardRef.current,
          { opacity: 0, y: 50, rotationX: -15 },
          { 
            opacity: 1, 
            y: 0, 
            rotationX: 0, 
            duration: 1.5, 
            delay: 2.2,
            ease: "power3.out"
          }
        );
      }

      // Create floating animation for particles
      gsap.to(".floating-particle", {
        y: () => gsap.utils.random(-20, 20),
        x: () => gsap.utils.random(-15, 15),
        rotation: () => gsap.utils.random(-10, 10),
        duration: () => gsap.utils.random(3, 6),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.1
      });

      // Create pulsing glow effect
      gsap.to(".glow-element", {
        scale: 1.05,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      });

      // Animate the browser window dots
      gsap.to(".browser-dot", {
        scale: 1.2,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "power1.inOut"
      });

      // Create typing effect for the demo input
      const demoInput = document.querySelector(".demo-input");
      if (demoInput) {
        gsap.to(demoInput, {
          text: {
            value: "Build an amazing project...",
            speed: 0.8,
          },
          duration: 3,
          delay: 3.5,
          repeat: -1,
          repeatDelay: 2,
          yoyo: true,
          ease: "none"
        });
      }

      // Animate feature cards
      gsap.fromTo(".feature-card",
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          delay: 2.5,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {orbs.map(orb => (
          <div
            key={orb.id}
            className={`glow-element absolute rounded-full bg-gradient-to-r ${orb.color} blur-3xl opacity-0`}
            style={{
              top: `${orb.top}%`,
              left: `${orb.left}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
            }}
          />
        ))}
        
        {particles.map(particle => (
          <div
            key={particle.id}
            className="floating-particle absolute rounded-full bg-white opacity-10"
            style={{
              top: `${particle.top}%`,
              left: `${particle.left}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
        
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2%, transparent 50%)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        <h1 
          ref={mainTitleRef}
          className="text-6xl md:text-8xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 drop-shadow-2xl"
        >
          {/* Text will be populated by GSAP animation */}
          &nbsp;
        </h1>
        
        <p 
          ref={subtitleRef}
          className="text-xl md:text-2xl mb-10 text-center max-w-2xl mx-auto opacity-0"
        >
          The minimalist todo app that helps you focus on what matters.
        </p>
        
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            href="/todo"
            className="cta-button px-8 py-4 bg-white text-blue-900 font-semibold rounded-full hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/30 relative overflow-hidden group opacity-0"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          
          <button className="cta-button px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden opacity-0">
            <span className="relative z-10">Learn More</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </button>
        </div>
        
        <div 
          ref={demoCardRef}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl max-w-3xl w-full border border-white/20 transform transition-all duration-500 hover:shadow-pink-500/20 hover:scale-105 opacity-0"
        >
          {/* Browser-style header */}
          <div className="flex items-center mb-4">
            <div className="browser-dot w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="browser-dot w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="browser-dot w-3 h-3 rounded-full bg-green-500"></div>
            <div className="flex-1 text-center text-sm text-white/60 font-mono">aetherlist.demo</div>
          </div>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center group">
              <div className="w-5 h-5 rounded-full border-2 border-white mr-3 group-hover:border-pink-500 transition-colors duration-300"></div>
              <span className="text-lg group-hover:text-pink-300 transition-colors duration-300">Create a new task</span>
            </div>
            <div className="flex items-center group opacity-70">
              <div className="w-5 h-5 rounded-full border-2 border-white mr-3 group-hover:border-yellow-500 transition-colors duration-300"></div>
              <span className="text-lg group-hover:text-yellow-300 transition-colors duration-300">Complete tasks with a click</span>
            </div>
            <div className="flex items-center group opacity-50">
              <div className="w-5 h-5 rounded-full border-2 border-white mr-3 group-hover:border-green-500 transition-colors duration-300"></div>
              <span className="text-lg group-hover:text-green-300 transition-colors duration-300">Organize your day efficiently</span>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex bg-black/20 rounded-lg p-2">
              <input 
                type="text" 
                className="demo-input flex-1 bg-transparent border-none text-white placeholder-white/50 focus:outline-none px-2"
                placeholder="Type a new task..."
                disabled
              />
              <button className="bg-gradient-to-r from-pink-500 to-violet-500 px-4 py-2 rounded-md font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300">
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Floating features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
         {[
            { icon: "⚡", title: "Lightning Fast", desc: "Instant responses and smooth interactions" },
            { icon: "🎨", title: "Beautiful UI", desc: "Clean, modern design that delights" },
            { icon: "🔒", title: "Your Data Stays", desc: "Everything stored locally on your device" },
          ].map((feature, index) => (
            <div 
              key={index}
              className="feature-card bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10 hover:border-pink-500/30 transition-all duration-500 hover:scale-105 opacity-0"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}