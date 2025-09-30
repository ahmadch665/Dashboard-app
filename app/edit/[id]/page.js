"use client";
import { MdArrowBack } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import { FaThLarge, FaPalette } from "react-icons/fa";
import { MdOutlineWeb, MdImage } from "react-icons/md";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { db } from "@/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function EditApp() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : null; // Firestore doc id

  const fileInputRef = useRef(null);

  const [iconFile, setIconFile] = useState(null);
  const [appName, setAppName] = useState("");
  const [appColor, setAppColor] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [appImg, setAppImg] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch app from Firestore
  useEffect(() => {
    const fetchApp = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "apps", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setAppName(data.name || "");
         setAppColor(data.color || "");
setAppUrl(data.url || "");

          setAppImg(data.iconUrl || "");
        } else {
          console.warn("No such document!");
        }
      } catch (err) {
        console.error("Error fetching app:", err);
      }
    };
    fetchApp();
  }, [id]);

  const handleIconPick = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconFile(file);
      const url = URL.createObjectURL(file);
      setAppImg(url);
    }
  };

  const handlePickClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!id) return;

    try {
      setLoading(true);

      let uploadedUrl = appImg || "https://via.placeholder.com/100";

      // If new icon selected, upload
      if (iconFile) {
        const formData = new FormData();
        formData.append("files", iconFile);

        const res = await fetch(
          "https://imageupload-xfga.onrender.com/api/file/uploadimage",
          { method: "POST", body: formData }
        );

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          uploadedUrl = data?.data?.[0]?.image || uploadedUrl;
        } else {
          const text = await res.text();
          console.error("Non-JSON response:", text);
        }
      }

      // Update Firestore doc
      const docRef = doc(db, "apps", id);
     await updateDoc(docRef, {
  name: appName,
  color: appColor,
  url: appUrl,
  iconUrl: uploadedUrl,
  updatedAt: serverTimestamp(),
});


      router.push("/");
    } catch (err) {
      console.error("Error saving app:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen 
                    bg-gradient-to-br from-[#f9eef2] via-[#f5f7fa] to-[#eef2f7] 
                    px-4 py-8">
      {/* Top header */}
      <div className="w-full flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-gray-700 cursor-pointer hover:scale-110 transition"
        >
          <MdArrowBack size={28} />
        </button>
        <h1 className="mx-auto text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Edit App Info
        </h1>
      </div>

      {/* Circle with current app icon */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-18 h-18 rounded-xl 
                        flex items-center justify-center bg-white overflow-hidden 
                        shadow-lg hover:scale-105 transition">
          {appImg ? (
            <Image
              src={appImg}
              alt={appName}
              width={100}
              height={100}
              className="w-full h-full object-contain"
            />
          ) : (
            <MdImage size={40} className="text-blue-500" />
          )}
        </div>
      </div>

      {/* Whole Form */}
      <form
        onSubmit={handleSave}
        className="w-full max-w-md bg-white/70 backdrop-blur-md 
                   rounded-2xl shadow-xl p-6 space-y-6 border border-gray-100"
      >
        {/* App Name */}
        <div className="relative">
          <fieldset className="border border-gray-300 bg-white rounded-lg px-3 pt-4 pb-2">
            <legend className="px-1 text-sm text-gray-500">App Name</legend>
            <div className="flex items-center">
              <FaThLarge className="text-blue-500 mr-2" />
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
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
                value={appColor}
                onChange={(e) => setAppColor(e.target.value)}
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
                value={appUrl}
                onChange={(e) => setAppUrl(e.target.value)}
                className="w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </fieldset>
        </div>

        {/* Pick Icon */}
        <div className="flex items-center space-x-4">
          <label className="w-20 h-20 border rounded-lg flex items-center justify-center 
                           bg-gray-100 cursor-pointer overflow-hidden hover:scale-105 transition">
            {iconFile ? (
              <Image
                src={URL.createObjectURL(iconFile)}
                alt="Picked Icon"
                width={80}
                height={80}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <MdImage size={32} className="text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleIconPick}
            />
          </label>
          <span
            onClick={handlePickClick}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Pick Icon From Gallery
          </span>
        </div>

        {/* Save Changes button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 
                     text-white py-3 rounded-xl font-semibold shadow-lg 
                     hover:scale-105 transition-transform cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
