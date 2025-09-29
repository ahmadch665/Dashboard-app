"use client";

import { Suspense } from "react";
import GenerateApkContent from "./GenerateApkContent";

export default function GenerateApkPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <GenerateApkContent />
    </Suspense>
  );
}
