# EcoLife — Capacitor Android guide

This project uses [Capacitor](https://capacitorjs.com/) to wrap the Create React App production build in a native Android WebView.

## Project layout

| Path | Purpose |
|------|---------|
| `frontend/capacitor.config.ts` | App id, name, `webDir: build`, plugin defaults |
| `frontend/android/` | Android Studio / Gradle project (commit this folder) |
| `frontend/src/config/apiBaseUrl.js` | API base URL for web vs Android emulator vs env override |
| `frontend/android/.../network_security_config.xml` | Allows HTTP to your dev backend (see security note below) |

## Prerequisites

- **Node.js** (LTS)
- **JDK 17** (Android Studio includes a bundled JDK; Gradle uses it)
- **Android Studio** (latest stable) with **Android SDK**, **SDK Platform**, and an **emulator** image (or a USB‑debugging phone)
- **Backend** running when you test API features (MongoDB + `npm run start:backend` from repo root)

## 1. Install dependencies

From the **repository root**:

```bash
npm run install:all
```

Or from `frontend/`:

```bash
npm install
```

## 2. Build the React app

From `frontend/`:

```bash
npm run build
```

This outputs static files to `frontend/build/`, which Capacitor copies into the Android project.

## 3. Copy web assets into the native project (sync)

From `frontend/`:

```bash
npm run cap:sync
```

This runs `npm run build` and `npx cap sync` so `build/` is copied and native plugins are updated.

From **repository root** (shortcut):

```bash
npm run cap:sync
```

## 4. Open in Android Studio

From `frontend/`:

```bash
npm run cap:open:android
```

Or open **Android Studio** → **Open** → select the folder `frontend/android/`.

First sync: let Gradle download dependencies (may take several minutes).

## 5. Run on an emulator or device

1. In Android Studio: **Device Manager** → create/start a virtual device, or connect a phone with **USB debugging** enabled.
2. Select the device in the toolbar.
3. Click **Run** (green triangle) for the `app` configuration.

The WebView loads your bundled React app from `assets/public`.

## 6. Build a release APK / App Bundle

1. **Sync** after any web change: `npm run cap:sync` (from `frontend/`).
2. Android Studio: **Build → Generate Signed Bundle / APK** (or **Build → Build Bundle(s) / APK(s)** for debug).
3. Follow the wizard to create or reuse a keystore for **release** builds.
4. Output: `android/app/build/outputs/apk/` or `.../bundle/`.

For a quick **debug APK** (local testing only):

- **Build → Build Bundle(s) / APK(s) → Build APK(s)**

## API calls from the Android app

| Environment | Base URL (default) |
|-------------|---------------------|
| Browser dev (`npm start`) | `http://localhost:5000/api` (or `REACT_APP_API_URL`) |
| Android **emulator** | `http://10.0.2.2:5000/api` (maps to the host machine’s loopback) |
| Physical **phone/tablet** | Set `REACT_APP_API_URL` to your PC’s LAN address before building, e.g. `http://192.168.1.50:5000/api` |

Implementation: `src/config/apiBaseUrl.js` + `src/services/productService.js`.

**Backend must listen on all interfaces** (your server already uses `0.0.0.0`). Ensure **Windows Firewall** allows inbound TCP on your API port (e.g. 5000) when testing from a real device on Wi‑Fi.

### Physical device checklist

1. PC and phone on the **same Wi‑Fi**.
2. Find PC IP: `ipconfig` (Windows) → IPv4 address.
3. Create `frontend/.env.production.local` (or `.env.local` before `npm run build`):

   ```env
   REACT_APP_API_URL=http://YOUR_PC_IP:5000/api
   ```

4. `npm run build` and `npm run cap:sync`.

## Security note (HTTP cleartext)

`network_security_config.xml` allows **cleartext HTTP** for local development (emulator + LAN). For **production**, serve the API over **HTTPS** and remove or narrow cleartext rules.

## Optional plugins (future native features)

Install from `frontend/` as needed:

| Feature | Package |
|---------|---------|
| Camera / photos | `@capacitor/camera` |
| Files / Storage | `@capacitor/filesystem`, `@capacitor/preferences` (key-value) |
| Push (FCM) | `@capacitor/push-notifications` + Firebase setup |
| Geolocation | `@capacitor/geolocation` |
| Share sheet | `@capacitor/share` |
| Haptics | `@capacitor/haptics` |
| Network status | `@capacitor/network` |

After adding a plugin: `npm install @capacitor/<plugin>`, then `npm run cap:sync`.

Docs: [Capacitor Plugins](https://capacitorjs.com/docs/plugins).

## Troubleshooting

- **Blank WebView:** Confirm `npm run build` succeeded and `npm run cap:sync` was run after code changes.
- **API errors on emulator:** Backend running on host? Try `http://10.0.2.2:5000/api/health` from the host browser is not the same as inside the emulator—use the app or `adb` if needed.
- **Gradle / JDK errors:** Use Android Studio’s **File → Settings → Build, Execution, Deployment → Build Tools → Gradle** and set Gradle JDK to **17**.
- **White screen after splash:** Open **Logcat** in Android Studio and filter for `chromium` / `Capacitor` for JS errors.
