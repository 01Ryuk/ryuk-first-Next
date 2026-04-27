"use client";

import Link from "next/link";
import Image from "next/image";
import { auth } from "../lib/auth";
import { signOut } from "@/src/actions/actions";
import { useRouter } from "next/navigation";

type Session = typeof auth.$Infer.Session;

export default function Header({ session }: { session: Session | null }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };
  return (
    <div className="bg-gray-800 text-white py-4">
      <nav className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/ryuk.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-cover rounded-full"
            priority
          />
          <span className="text-xl font-bold">RYUK</span>
        </Link>
        <ul className="flex items-center space-x-6">
        {session && (
          <>
          <li>
            <Link
              href="/post"
              className="hover:text-gray-300 transition-colors"
              >
              Posts
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className="hover:text-gray-300 transition-colors"
              >
              Dashboard
            </Link>
          </li>
  
            <li>
              <button
                onClick={handleSignOut}
                className="hover:text-gray-300 transition-colors"
                >
                Sign out
              </button>
            </li>
                </>
          )}

          {!session && (
            <>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-gray-300 transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/signup"
                  className="hover:text-gray-300 transition-colors"
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}
