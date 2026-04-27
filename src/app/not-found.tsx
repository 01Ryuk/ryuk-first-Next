"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 overflow-hidden z-50">
      {" "}
      {/* Animated background circles */}
      <div className="absolute w-96 h-96 bg-blue-500 rounded-full opacity-10 animate-ping pointer-events-none" />
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full opacity-10 animate-pulse pointer-events-none" />
      {/* 404 text that follows mouse */}
      <h1
        className="text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 leading-none select-none transition-transform duration-100"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        404
      </h1>
      <h2 className="text-2xl font-semibold text-white mt-4 animate-bounce">
        You look lost...
      </h2>
      <p className="text-gray-400 mt-2 text-center max-w-md px-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:scale-105 transition-transform duration-200"
      >
        Take me home
      </Link>
    </div>
  );
}
