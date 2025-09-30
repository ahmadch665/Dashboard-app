"use client";

import { useState, useEffect } from "react";
import { FaThLarge, FaPalette } from "react-icons/fa";
import { MdOutlineWeb, MdAdd, MdImage, MdArrowBack } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddNewApp() {
  const router = useRouter();
  const [icon, setIcon] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Preview selected icon
  const handleIconPick = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIcon(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (icon) {
      const objectUrl = URL.createObjectURL(icon);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [icon]);

  const handleAdd = async () => {
    if (!icon) return alert("Please pick an icon");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", icon);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Upload Result:", result);

      if (result?.success && result.file) {
        const apps = JSON.parse(localStorage.getItem("apps") || "[]");
        apps.push({
          name,
          color,
          url,
          img: result.file, // uploaded image URL
        });
        localStorage.setItem("apps", JSON.stringify(apps));
        router.push("/");
      } else {
        alert("Upload failed. Try again.");
      }
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed. Check console.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9eef2] via-[#f5f7fa] to-[#eef2f7] flex flex-col items-center py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <MdArrowBack size={26} className="text-gray-700" />
        </button>
        <h1 className="mx-auto text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Add New App Info
        </h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-100">
        {/* Circle + Plus */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center shadow-md">
            <MdAdd size={32} className="text-blue-500" />
          </div>
          <p className="mt-2 text-blue-600 font-semibold text-base">
            Enter App Configuration
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* App Name */}
          <fieldset className="border border-gray-200 bg-white rounded-xl px-3 pt-4 pb-2 shadow-sm">
            <legend className="px-1 text-sm text-gray-500">App Name</legend>
            <div className="flex items-center gap-2">
              <FaThLarge className="text-blue-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter app name"
                className="w-full outline-none text-gray-700 bg-transparent text-sm"
              />
            </div>
          </fieldset>

          {/* AppBar Color */}
          <fieldset className="border border-gray-200 bg-white rounded-xl px-3 pt-4 pb-2 shadow-sm">
            <legend className="px-1 text-sm text-gray-500">AppBar Color</legend>
            <div className="flex items-center gap-2">
              <FaPalette className="text-blue-500" />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#1877F2"
                className="w-full outline-none text-gray-700 bg-transparent text-sm"
              />
            </div>
          </fieldset>

          {/* Web URL */}
          <fieldset className="border border-gray-200 bg-white rounded-xl px-3 pt-4 pb-2 shadow-sm">
            <legend className="px-1 text-sm text-gray-500">Web URL</legend>
            <div className="flex items-center gap-2">
              <MdOutlineWeb className="text-blue-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full outline-none text-gray-700 bg-transparent text-sm"
              />
            </div>
          </fieldset>

          {/* Pick Icon */}
          <div className="flex items-center gap-3">
            <label className="w-20 h-20 border rounded-xl flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden shadow-sm hover:scale-105 transition">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Picked Icon"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <MdImage size={28} className="text-gray-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconPick}
              />
            </label>
            <span className="text-blue-500 font-medium text-sm cursor-pointer">
              Pick Icon From Gallery
            </span>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={uploading}
            className={`w-full py-3 rounded-xl font-semibold text-base text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-md hover:scale-105 transition cursor-pointer ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Add Record"}
          </button>
        </div>
      </div>
    </div>
  );
}
