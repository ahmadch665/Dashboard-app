import { NextResponse } from "next/server";
import path from "path";
import { exec } from "child_process";

export async function POST(req) {
  try {
    const { appName } = await req.json();

    if (!appName) {
      return NextResponse.json(
        { success: false, error: "App name is required" },
        { status: 400 }
      );
    }

    // Paths
    const projectRoot = path.resolve(".");
    const keystorePath = path.join(projectRoot, "Dashboard-app", "my-release-key.jks");
    const apkOutput = path.join(projectRoot, "app", "build", "outputs", "apk", "release", "app-release.apk");

    // Command for Windows (skip clean to avoid locks)
    const gradleCmd = `cd "${projectRoot}" && gradlew.bat assembleRelease -PMYAPP_RELEASE_STORE_FILE="${keystorePath}" -PMYAPP_RELEASE_KEY_ALIAS="my-key-alias" -PMYAPP_RELEASE_STORE_PASSWORD="123456" -PMYAPP_RELEASE_KEY_PASSWORD="123456" --no-daemon`;

    console.log("Running Gradle command:", gradleCmd);

    const { stdout, stderr } = await new Promise((resolve) => {
      exec(gradleCmd, { shell: true }, (error, stdout, stderr) => {
        resolve({ stdout, stderr, error });
      });
    });

    if (stderr) {
      console.error("Gradle Error:", stderr);
    }

    // Check if APK exists
    const fs = require("fs");
    if (!fs.existsSync(apkOutput)) {
      return NextResponse.json(
        { success: false, error: "APK not generated. Check Gradle logs." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "APK generated successfully!",
      apkPath: `/build/outputs/apk/release/app-release.apk`, // you can later serve this properly
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
