"use client";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdFileDownload, MdEdit, MdBuild } from "react-icons/md";

export default function Home() {
  const [apps, setApps] = useState([]);
  const [downloadProgress, setDownloadProgress] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  let pressTimer = null;

  // Load apps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("apps");
    if (saved) {
      const parsed = JSON.parse(saved);
      setApps(parsed);
      setDownloadProgress(Array(parsed.length).fill(0));
    } else {
      const defaultApps = [
        {
          name: "WhatsApp",
          img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
          color: "#25D366",
          url: "https://www.whatsapp.com",
        },
        {
          name: "Instagram",
          img: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
          color: "#C13584",
          url: "https://www.instagram.com",
        },
        {
          name: "Facebook",
          img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
          color: "#1877F2",
          url: "https://www.facebook.com",
        },
        {
          name: "YouTube",
          img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
          color: "#FF0000",
          url: "https://www.youtube.com",
        },
      ];
      localStorage.setItem("apps", JSON.stringify(defaultApps));
      setApps(defaultApps);
      setDownloadProgress(Array(defaultApps.length).fill(0));
    }
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

  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updatedApps = apps.filter((_, i) => i !== deleteIndex);
      setApps(updatedApps);
      localStorage.setItem("apps", JSON.stringify(updatedApps));
      setDeleteIndex(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="min-h-screen bg-[#f9eef2] flex flex-col items-center py-8 px-4 text-black w-full">
        {/* Header with Add New App button */}
        <div className="w-full max-w-6xl flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <Link href="/add-new-app">
            <button
              className="bg-[#2F9BFF] text-white px-6 py-3 rounded-full text-lg font-medium shadow-2xl cursor-pointer"
              aria-label="Add New App"
            >
              Add New App
            </button>
          </Link>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {apps.map((app, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center"
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
              <div className="w-24 h-24 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                <img
                  src={app.img}
                  alt={app.name}
                  className="object-contain w-full h-full"
                />
              </div>

              <h2 className="text-lg font-semibold mb-3">{app.name}</h2>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 mt-2">
                {/* Download */}
                <button
                  aria-label="download"
                  onClick={() => handleDownload(i)}
                  className="w-14 h-14 rounded-full bg-[#2F9BFF] flex items-center justify-center 
                             shadow-md text-white font-semibold cursor-pointer hover:bg-[#238ae6] 
                             transition duration-200"
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
                  href={`/edit/${i}`}
                  className="w-14 h-14 rounded-full bg-[#30A75B] flex items-center justify-center 
                             shadow-md hover:bg-[#278a4c] transition duration-200"
                >
                  <MdEdit size={20} color="#fff" />
                </Link>

                {/* Generate APK */}
                <Link
                  href={`/generate-apk?name=${encodeURIComponent(
                    app.name
                  )}&img=${encodeURIComponent(app.img)}`}
                  className="w-14 h-14 rounded-full bg-[#F05449] flex items-center justify-center 
                             shadow-md hover:bg-[#d94439] transition duration-200"
                >
                  <MdBuild size={20} color="#fff" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4 text-black">
              Delete Confirmation
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this app?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 rounded-full bg-gray-200 text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-full bg-red-500 text-white font-medium"
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
