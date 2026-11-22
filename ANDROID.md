# PokeCollection — Android APK

This repository can be packaged as an installable Android application without relying on GitHub Pages at runtime.

## What is included

- The existing HTML, CSS and JavaScript application is kept intact.
- The existing collection data and localStorage persistence remain in the Android WebView.
- The `images/` directory is copied into the app bundle when it exists, so locally archived Japanese card scans remain available offline.
- No server URL or GitHub Pages URL is configured in the native app.

The card collection itself is stored locally on the device. Export a JSON backup regularly from the app settings: uninstalling the app or clearing its storage can erase that local data.

## Build from GitHub

The **Build Android APK** workflow runs on pushes and pull requests to `main`, and can also be started manually from the Actions tab.

When it completes:
1. Open the successful workflow run in GitHub Actions.
2. Download the `PokeCollection-debug-apk` artifact.
3. Extract the ZIP and install `app-debug.apk` on the Android phone. Android may ask permission to install apps from that source.

This is a debug APK intended for personal installation, not a Play Store release.

## Build locally

Requirements: Node.js 22, Java 21, Android SDK and Android platform tools.

```bash
npm install
npm run prepare:android
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.

## Offline limitations

The app shell, bundled JavaScript/data and any card scans committed under `images/` are local. The existing application still contains optional remote fallbacks (PokéAPI sprites, Pokémon name autocomplete and the Google-hosted pixel font). Those fallbacks are not guaranteed offline; they do not make the app depend on GitHub Pages. Japanese card scans are offline only when their files are present in the repository under `images/cards/`.

## Updating the app

A new APK must be built and installed to update the installed application. Keep the same Android package ID (`com.steamfor.pokecollection`) so Android recognizes it as the same app. Export the collection before major updates as a safety backup.
