"use client";

import { Poppins } from "next/font/google";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { login } from "@/server/actions/auth/auth.action";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

const Page = () => {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await login(formData);

      if (!response?.success) {
        setError(response.message);
      } else {
        setSuccess("Login successful. Redirecting…");
        setTimeout(() => {
          router.push("../dashboard");
        }, 1000);
      }
    } catch (err: any) {
      setError(err?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col items-center pt-20 gap-4">
        <img src="/photos/speakup.png" alt="SpeakUp" className="w-20 h-20" />
        <h3 className={`${poppins.className} font-black text-lg`}>
          Admin Portal
        </h3>
        <h6 className="text-lg text-gray-300 dark:text-gray-600">
          Administrator Access Only
        </h6>
      </div>

      <div className="mt-10 p-6 shadow-2xl dark:shadow-blue-900/50 dark:bg-blue-900/30 rounded-xl w-100 flex flex-col gap-3">
        {error && (
          <div className="rounded-lg bg-red-100 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-100 text-green-700 px-3 py-2 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h3>Email</h3>
            <input
              type="email"
              name="email"
              placeholder="example@example.example"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg px-3 py-2
                bg-white dark:bg-blue-950/20
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2
                focus:ring-gray-500/40 dark:focus:ring-blue-400/30"
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <h3>Password</h3>
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg px-3 py-2
                bg-white dark:bg-blue-950/20
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                focus:outline-none focus:ring-2
                focus:ring-gray-500/40 dark:focus:ring-blue-400/30"
            />

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-9
                text-gray-500 hover:text-gray-700
                dark:text-gray-400 dark:hover:text-gray-200"
            >
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            disabled={loading}
            className="mt-4 w-full bg-blue-700 h-8 text-white rounded-lg
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>

        <div className="w-full text-center mt-4">
          <Link href="" className="text-blue-500">
            Forgot Password?
          </Link>
        </div>
      </div>

      <div className="w-full flex gap-2 items-center justify-center mt-16 mb-6">
        <Shield size={18} className="text-gray-600" />
        <h5 className="text-gray-600 text-sm">
          Authorized personnel only. All access is logged.
        </h5>
      </div>
    </div>
  );
};

export default Page;
