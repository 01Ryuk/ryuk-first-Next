import Link from "next/link";

export default async function Home() {
  return (
    <div className="text-center pt-12">
      <div>
        <h1 className="text-3xl capitalize font-bold">Welcome to my blog!</h1>
        <p className="text-[16px]">This is a next js blog </p>
      </div>

      {/* <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/auth/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
        >
          Sign Up
        </Link>
      </div> */}
    </div>
  );
}
