"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { submitReport } from "@/server/actions/Reports/reports.action";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export default function Home() {
  const [selected, setSelected] = useState<"suggestion" | "complaint">(
    "suggestion",
  );
  const [anonymous, setAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set("type", selected);
    formData.set("anonymous", String(anonymous));

    if (anonymous) {
      formData.delete("name");
      formData.delete("email");
      formData.delete("phone");
    }

    try {
      await submitReport(formData);
      form.reset();
      setAnonymous(true);
      setSelected("suggestion");
      alert("Report submitted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center pt-20 gap-4">
        <img src="/photos/speakup.png" alt="SpeakUp" className="w-30 h-20" />
        <h3
          className={`${poppins.className} font-black text-2xl text-gray-300 dark:text-gray-600`}
        >
          Your Voice Matters
        </h3>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-xl
          border border-gray-300 dark:border-gray-700
          rounded-lg p-4 mt-4
          bg-white dark:bg-[#0f0f0f]
          mb-10
        "
      >
        <h1 className={`${poppins.className} font-semibold text-2xl mb-4`}>
          Submit a Suggestion or Complaint
        </h1>

        <div className="relative w-full h-10 bg-gray-200 dark:bg-gray-800 rounded-full p-1 mb-4">
          <div
            className={`absolute top-1 left-1 h-8 w-[calc(50%-0.25rem)]
            rounded-full transition-transform duration-300
            bg-white dark:bg-gray-900 shadow
            ${selected === "complaint" ? "translate-x-full" : ""}`}
          />
          <div className="relative z-10 flex h-full">
            <button
              type="button"
              onClick={() => setSelected("suggestion")}
              className={`w-1/2 rounded-full font-medium ${
                selected === "suggestion"
                  ? "text-black dark:text-white"
                  : "text-gray-500"
              }`}
            >
              Suggestion
            </button>
            <button
              type="button"
              onClick={() => setSelected("complaint")}
              className={`w-1/2 rounded-full font-medium ${
                selected === "complaint"
                  ? "text-black dark:text-white"
                  : "text-gray-500"
              }`}
            >
              Complaint
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <label className="font-medium">Category *</label>
          <select
            name="category"
            required
            className="border rounded-lg px-3 py-2 bg-white dark:bg-[#0f0f0f]"
          >
            <option value="">Select a Category</option>
            <option value="public-services">Public Services</option>
            <option value="permits">Permits & Licenses</option>
            <option value="billing">Fees & Payments</option>
            <option value="staff">Personnel Conduct</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 mb-3">
          <label className="font-medium">Title *</label>
          <input
            name="title"
            required
            placeholder="Brief summary"
            className="border rounded-lg px-3 py-2 bg-white dark:bg-[#0f0f0f]"
          />
        </div>

        <div className="flex flex-col gap-1 mb-6">
          <label className="font-medium">Description *</label>
          <textarea
            name="description"
            required
            placeholder="Provide details..."
            className="border rounded-lg px-3 py-2 bg-white dark:bg-[#0f0f0f]"
          />
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 mb-6">
          <button
            type="button"
            onClick={() => setAnonymous(!anonymous)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition
              ${anonymous ? "bg-black dark:bg-white" : "bg-gray-300"}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-black transition
                ${anonymous ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>

          <div>
            <h3 className="font-semibold">Submit Anonymously</h3>
            <p className="text-sm text-gray-600">
              Your identity will not be collected.
            </p>
          </div>
        </div>

        {!anonymous && (
          <div className="bg-gray-50 dark:bg-blue-900/10 p-4 rounded-xl mb-6 space-y-4">
            <h3 className="font-semibold">Contact Information</h3>
            <input
              name="name"
              placeholder="Full Name"
              className="w-full rounded-lg px-3 py-2"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full rounded-lg px-3 py-2"
            />
            <input
              name="phone"
              placeholder="+63"
              className="w-full rounded-lg px-3 py-2"
            />
          </div>
        )}

        <button
          disabled={loading}
          type="submit"
          className="w-full h-12 rounded-xl bg-black text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit to SpeakUp"}
        </button>
      </form>

      <button
        onClick={() => router.push("/auth")}
        className="mb-10 text-sm cursor-pointer"
      >
        Login as Administrator
      </button>

      <div className="mb-4">
        <h3 className="text-gray-600">Developed By: Shem Regidor</h3>
      </div>
    </div>
  );
}
