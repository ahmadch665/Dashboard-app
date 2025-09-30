"use client";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdFileDownload, MdEdit, MdBuild } from "react-icons/md";
import Image from "next/image";

// 🔹 Firestore imports
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";

export default function Home() {
  const [apps, setApps] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  let pressTimer = null;

  // 🔹 Live load apps from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "apps"), (snapshot) => {
      const appsData = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setApps(appsData);
      setDownloadProgress(Array(appsData.length).fill(0));
    });

    return () => unsubscribe();
  }, []);

  const handleDownload = (index) => {
    if (downloadProgress[index] > 0 && downloadProgress[index] < 100) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDownloadProgress((prev) => {
        const updated = [...prev];
        updated[index] = progress;
        return updated;
      });

      if (progress >= 100) clearInterval(interval);
    }, 300);
  };

  // 🔹 Delete from Firestore
  const handleDelete = async () => {
    if (deleteIndex !== null) {
      try {
        const appToDelete = apps[deleteIndex];
        await deleteDoc(doc(db, "apps", appToDelete.id));

        setDeleteIndex(null);
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting app:", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#f9eef2] via-[#f5f7fa] to-[#eef2f7] flex flex-col items-center py-10 px-4 text-black w-full">
        {/* Header with Add New App button */}
        <div className="w-full max-w-6xl flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <Link href="/add-new-app">
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white 
                         px-4 py-2 sm:px-6 sm:py-3 rounded-xl 
                         text-base sm:text-lg font-medium shadow-lg 
                         hover:scale-105 transition-transform duration-300 cursor-pointer 
                         whitespace-nowrap"
              aria-label="Add New App"
            >
              Add New App
            </button>
          </Link>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {apps.map((app, i) => (
            <div
              key={app.id}
              className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg 
                         flex flex-col items-center border border-gray-100 hover:shadow-2xl 
                         transition-all duration-300 cursor-pointer group"
              onMouseDown={() => {
                pressTimer = setTimeout(() => {
                  setDeleteIndex(i);
                  setShowDeleteModal(true);
                }, 1000);
              }}
              onMouseUp={() => clearTimeout(pressTimer)}
              onMouseLeave={() => clearTimeout(pressTimer)}
              onTouchStart={() => {
                pressTimer = setTimeout(() => {
                  setDeleteIndex(i);
                  setShowDeleteModal(true);
                }, 1000);
              }}
              onTouchEnd={() => clearTimeout(pressTimer)}
            >
              {/* App Image */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 flex items-center justify-center relative shadow-md group-hover:scale-105 transition-transform">
                <Image
                  src={app.iconUrl || "/placeholder.png"}
                  alt={app.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="object-contain p-2"
                />
              </div>

              <h2 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                {app.name}
              </h2>

              {/* Action Buttons */}
              <div className="flex items-center gap-5 mt-2">
                {/* Download */}
                <button
                  aria-label="download"
                  onClick={() => handleDownload(i)}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 
                             flex items-center justify-center shadow-md text-white font-semibold 
                             cursor-pointer hover:scale-110 transition-all duration-300"
                >
                  {downloadProgress[i] === 0 ? (
                    <MdFileDownload size={22} />
                  ) : downloadProgress[i] < 100 ? (
                    <span className="text-sm">{downloadProgress[i]}%</span>
                  ) : (
                    <span className="text-lg">✓</span>
                  )}
                </button>

                {/* Edit */}
                <Link
                  href={`/edit/${app.id}`}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 
                             flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300"
                >
                  <MdEdit size={20} color="#fff" />
                </Link>

                {/* Generate APK */}
                <Link
                  href={`/generate-apk?name=${encodeURIComponent(app.name)}&img=${encodeURIComponent(app.iconUrl || "")}`}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-600 
                             flex items-center justify-center shadow-md hover:scale-110 transition-all duration-300"
                >
                  <MdBuild size={18} color="#fff" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-80 text-center animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Delete Confirmation
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this app?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-xl bg-gray-100 text-gray-800 font-medium 
                           hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium 
                           hover:scale-105 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
