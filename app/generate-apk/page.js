"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function GenerateApkContent() {
  const searchParams = useSearchParams();
  const appName = searchParams.get("name") || "Unknown App";
  const appImg =
    searchParams.get("img") ||
    "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";

  return (
    <div className="min-h-screen bg-[#f9eef2] flex flex-col items-center justify-start py-10 px-4">
      {/* Header */}
      <div className="flex items-center w-full max-w-2xl mb-10">
        <Link href="/" className="text-2xl text-black mr-4">
          ←
        </Link>
        <h1 className="text-xl font-semibold">Generate Apk</h1>
      </div>

      {/* App Icon */}
      <div className="flex flex-col items-center justify-center mt-20">
        <Image
          src={appImg.startsWith("http") ? appImg : `/images/${appImg}`}
          alt={appName}
          width={112} // w-28
          height={112} // h-28
          className="mb-4 rounded-lg"
        />
        <h2 className="text-lg font-semibold mb-6">{appName}</h2>

        {/* Red Generate APK Button */}
        <button className="bg-[#F05449] text-white px-10 py-3 rounded-full text-lg font-medium shadow-lg hover:opacity-90 transition">
          Generate Apk
        </button>
      </div>
    </div>
  );
}
