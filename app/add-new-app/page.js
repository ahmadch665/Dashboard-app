"use client";

import { useState, useEffect } from "react";
import { FaThLarge, FaPalette } from "react-icons/fa";
import { MdOutlineWeb, MdAdd, MdImage } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddNewApp() {
const [icon, setIcon] = useState(null);
const [previewUrl, setPreviewUrl] = useState(null);
const [name, setName] = useState("");
const [color, setColor] = useState("");
const [url, setUrl] = useState("");

 const handleIconPick = (e) => {
  if (e.target.files && e.target.files[0]) {
    setIcon(e.target.files[0]);
  }
};

  // generate blob url whenever icon changes
  useEffect(() => {
    if (icon) {
      const objectUrl = URL.createObjectURL(icon);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [icon]);

  const handleAdd = () => {
    const apps = JSON.parse(localStorage.getItem("apps") || "[]");
    apps.push({
      name,
      color,
      url,
      img: previewUrl || "https://via.placeholder.com/100",
    });
    localStorage.setItem("apps", JSON.stringify(apps));
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-pink-50 px-4 py-6">
      {/* Top Header */}
      <div className="w-full flex items-center mb-4">
  <button
    onClick={() => window.history.back()}
    className="text-gray-700 cursor-pointer"
  >
    <MdArrowBack size={28} /> {/* 👈 bigger back arrow */}
  </button>
  <h1 className="mx-auto text-lg font-bold text-black">Add New App Info</h1>
</div>

      {/* Circle + Plus Icon */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center">
          <MdAdd size={36} className="text-blue-500" />
        </div>
        <p className="mt-2 text-blue-600 font-semibold">
          Enter App Configuration
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-md mt-6 space-y-4">
        {/* App Name */}
        <div className="relative">
          <fieldset className="border border-gray-300 bg-white rounded-lg px-3 pt-4 pb-2">
            <legend className="px-1 text-sm text-gray-500">App Name</legend>
            <div className="flex items-center">
              <FaThLarge className="text-blue-500 mr-2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </fieldset>
        </div>

        {/* AppBar Color */}
        <div className="relative">
          <fieldset className="border border-gray-300 bg-white rounded-lg px-3 pt-4 pb-2">
            <legend className="px-1 text-sm text-gray-500">AppBar Color</legend>
            <div className="flex items-center">
              <FaPalette className="text-blue-500 mr-2" />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </fieldset>
        </div>

        {/* Web URL */}
        <div className="relative">
          <fieldset className="border border-gray-300 bg-white rounded-lg px-3 pt-4 pb-2">
            <legend className="px-1 text-sm text-gray-500">Web URL</legend>
            <div className="flex items-center">
              <MdOutlineWeb className="text-blue-500 mr-2" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </fieldset>
        </div>

        {/* Pick Icon */}
        <div className="flex items-center space-x-3">
          <label className="w-20 h-20 border rounded-lg flex items-center justify-center bg-gray-100 cursor-pointer overflow-hidden">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Picked Icon"
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <MdImage size={32} className="text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleIconPick}
            />
          </label>
          <span className="text-blue-500 font-semibold cursor-pointer">
            Pick Icon From Gallery
          </span>
        </div>

        {/* Add Record Button */}
        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-600"
        >
          Add Record
        </button>
      </div>
    </div>
  );
}
