"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSubmit } from "@/src/actions/actions";
import Link from "next/link";

function StrengthBar({ password }: { password: string }) {
  const getStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? colors[strength] : "bg-stone-200"
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs ${strength <= 1 ? "text-red-500" : strength === 2 ? "text-amber-500" : strength === 3 ? "text-blue-500" : "text-green-600"}`}
      >
        {labels[strength]}
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;
  const valid = password.length >= 8 && password === confirm && !!token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setError("");
    setLoading(true);

    try {
      const result = await resetPasswordSubmit(password, token);
      if (result?.error) {
        setError(result.error);
      } else {
        setDone(true);
        setTimeout(() => router.push("/auth/login"), 2500);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. The link may have expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo / Brand mark */}
        <div className="flex justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L17 6V14L10 18L3 14V6L10 2Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="10" r="2.5" fill="white" />
            </svg>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 px-8 py-10">
          {!done ? (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-stone-900 tracking-tight mb-1.5">
                  Set a new password
                </h1>
                <p className="text-sm text-stone-500 leading-relaxed">
                  Choose something strong — at least 8 characters.
                </p>
              </div>

              {!token && (
                <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                  This reset link is invalid or has expired.{" "}
                  <Link
                    href="/auth/forgot-password"
                    className="underline underline-offset-2 font-medium hover:text-red-800"
                  >
                    Request a new one
                  </Link>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-stone-700"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-stone-300 text-stone-900 placeholder-stone-400 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <StrengthBar password={password} />
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="confirm"
                    className="block text-sm font-medium text-stone-700"
                  >
                    Confirm password
                  </label>
                  <input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-stone-900 placeholder-stone-400 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      mismatch
                        ? "border-red-300 focus:ring-red-400"
                        : "border-stone-300 focus:ring-stone-900"
                    }`}
                  />
                  {mismatch && (
                    <p className="text-xs text-red-500">
                      Passwords don&apos;t match
                    </p>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !valid}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-150 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Saving…
                    </>
                  ) : (
                    "Save new password"
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-900 mb-2">
                Password updated!
              </h2>
              <p className="text-sm text-stone-500 leading-relaxed">
                You&apos;re all set. Redirecting you to login…
              </p>
            </div>
          )}
        </div>

        {/* Back to login */}
        {!done && (
          <p className="text-center mt-6 text-sm text-stone-500">
            <Link
              href="/auth/login"
              className="text-stone-700 font-medium hover:text-stone-900 underline underline-offset-2 transition-colors"
            >
              ← Back to login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
