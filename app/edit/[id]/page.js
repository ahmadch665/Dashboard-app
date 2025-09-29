"use client";
import { MdArrowBack } from "react-icons/md"; 
import { useState, useEffect, useRef } from "react";
import { FaThLarge, FaPalette } from "react-icons/fa";
import { MdOutlineWeb, MdImage } from "react-icons/md";
import { useRouter, useParams } from "next/navigation";

export default function EditApp() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? parseInt(params.id, 10) : 0;

  const fileInputRef = useRef(null);

  const defaultApps = [
    {
      name: "WhatsApp",
      color: "#25D366",
      url: "https://www.whatsapp.com",
      img: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    },
    {
      name: "Instagram",
      color: "#C13584",
      url: "https://www.instagram.com",
      img: "https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png",
    },
    {
      name: "Facebook",
      color: "#1877F2",
      url: "https://www.facebook.com",
      img: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    },
    {
      name: "YouTube",
      color: "#FF0000",
      url: "https://www.youtube.com",
      img: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    },
  ];

  const [iconFile, setIconFile] = useState(null);
  const [appName, setAppName] = useState("");
  const [appColor, setAppColor] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [appImg, setAppImg] = useState("");

  // load from localStorage or defaults
  useEffect(() => {
    const saved = localStorage.getItem("apps");
    let appsArray;
    if (saved) {
      try {
        appsArray = JSON.parse(saved);
        if (!Array.isArray(appsArray) || appsArray.length === 0) {
          appsArray = defaultApps;
          localStorage.setItem("apps", JSON.stringify(defaultApps));
        }
      } catch {
        appsArray = defaultApps;
        localStorage.setItem("apps", JSON.stringify(defaultApps));
      }
    } else {
      appsArray = defaultApps;
      localStorage.setItem("apps", JSON.stringify(defaultApps));
    }

    const chosen = Number.isFinite(id) && appsArray[id] ? appsArray[id] : appsArray[0];
    setAppName(chosen.name || "");
    setAppColor(chosen.color || "");
    setAppUrl(chosen.url || "");
    setAppImg(chosen.img || "");
    setIconFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleIconPick = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIconFile(file);
      const url = URL.createObjectURL(file);
      setAppImg(url); // preview top circle immediately
    }
  };

  const handlePickClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (e) => {
    e.preventDefault();

    const saved = localStorage.getItem("apps");
    let appsArray = [];
    if (saved) {
      try {
        appsArray = JSON.parse(saved);
        if (!Array.isArray(appsArray)) appsArray = [];
      } catch {
        appsArray = [];
      }
    }

    const newImg = iconFile ? URL.createObjectURL(iconFile) : (appImg || "https://via.placeholder.com/100");

    const updatedApp = {
      name: appName,
      color: appColor,
      url: appUrl,
      img: newImg,
    };

    if (Number.isFinite(id) && id >= 0 && id < appsArray.length) {
      appsArray[id] = updatedApp;
    } else {
      appsArray.push(updatedApp);
    }

    localStorage.setItem("apps", JSON.stringify(appsArray));
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-pink-50 px-4 py-6">
      {/* Top header */}
     <div className="w-full flex items-center mb-4">
  <button
    onClick={() => window.history.back()}
    className="text-gray-700 cursor-pointer"
  >
    <MdArrowBack size={28} /> {/* 👈 bigger back arrow */}
  </button>
        <h1 className="mx-auto text-lg font-bold text-black">Edit App Info</h1>
      </div>

      {/* Circle with current app icon */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center bg-white overflow-hidden">
          {appImg ? (
  <Image
    src={appImg}
    alt={appName}
    width={80}
    height={80}
    className="w-full h-full object-contain"
  />
) : (
  <MdImage size={36} className="text-blue-500" />
)}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="w-full max-w-md mt-6 space-y-4">
        {/* App Name - label overlaps the border and floats to top-right */}
        {/* App Name */}
<div className="relative mt-4">
  <fieldset className="border border-gray-300 bg-white rounded-lg px-3 pt-4 pb-2">
    <legend className="px-1 text-sm text-gray-500">
      App Name
    </legend>

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
        <div className="relative mt-4">
  <fieldset className="border border-gray-300 bg-white rounded-lg px-3 pt-4 pb-2">
    <legend className="px-1 text-sm text-gray-500">
      AppBar Color
    </legend>

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

        <div className="relative mt-4">
  <fieldset className="border border-gray-300 bg-white rounded-lg px-3 pt-4 pb-2">
    <legend className="px-1 text-sm text-gray-500">
      Web URL
    </legend>

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
        <div className="flex items-center space-x-3">
          <label className="w-20 h-20 border rounded-lg flex items-center justify-center bg-gray-100 cursor-pointer overflow-hidden">
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

          <span onClick={handlePickClick} className="text-blue-500 font-semibold cursor-pointer">
            Pick Icon From Gallery
          </span>
        </div>

        {/* Save Changes button */}
        <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-600">
          Save Changes
        </button>
      </form>
    </div>
  );
}