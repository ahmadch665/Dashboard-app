"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { MdArrowBack } from "react-icons/md";

export default function GenerateApkContent() {
  const searchParams = useSearchParams();
  const appName = searchParams.get("name") || "Unknown App";
  const appImg =
    searchParams.get("img") ||
    "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/generate-apk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appName }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("✅ " + data.message);
      } else {
        setMessage("❌ " + data.error);
      }
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9eef2] via-[#f5f7fa] to-[#eef2f7] flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-3xl flex items-center mb-10">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <MdArrowBack size={26} className="text-gray-700" />
        </button>
        <h1 className="mx-auto text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Generate APK
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col items-center">
        <Image
          src={appImg.startsWith("http") ? appImg : `/images/${appImg}`}
          alt={appName}
          width={112}
          height={112}
          className="mb-6 rounded-xl shadow-md"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{appName}</h2>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:scale-105 transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate APK"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
