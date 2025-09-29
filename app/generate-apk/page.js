"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MdArrowBack } from "react-icons/md"; 


export default function GenerateApk() {
  const searchParams = useSearchParams();
  const appName = searchParams.get("name") || "Unknown App";
  const appImg =
    searchParams.get("img") ||
    "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";

  return (
    <div className="min-h-screen bg-[#f9eef2] flex flex-col items-center justify-start py-10 px-4 text-black">
      {/* Header */}
     <div className="flex items-center w-full max-w-2xl mb-10">
        <Link href="/"  onClick={() => window.history.back()}
    className="text-gray-700"
  >
    <MdArrowBack size={28} /> {/* 👈 bigger back arrow */}
        </Link>
        <h1 className="text-xl font-semibold text-black">Generate Apk</h1>
      </div>

      {/* App Icon */}
      <div className="flex flex-col items-center justify-center mt-20">
        <img
          src={appImg}
          alt={appName}
          className="w-28 h-28 mb-4"
        />
        <h2 className="text-lg font-semibold mb-6">{appName}</h2>

        {/* Red Generate APK Button */}
        <button className="bg-[#F05449] text-white px-10 py-3 rounded-full text-lg font-medium shadow-lg  ">
          Generate Apk
        </button>
      </div>
    </div>
  );
}