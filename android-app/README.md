# Pomegranate Technology Android App

This is a lightweight Android WebView app wrapper for `https://www.pomotech.in/`.

## Build

1. Open the `android-app` folder in Android Studio.
2. Let Android Studio sync Gradle dependencies.
3. Update `WEBSITE_URL` in `app/src/main/java/in/pomotech/app/MainActivity.java` if the production domain changes.
4. Build APK from `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

## Notes

- The app uses the existing Pomegranate Technology icon.
- External links open in the user's browser/app.
- The website is also installable as a PWA from Chrome because the root site includes `site.webmanifest` and `service-worker.js`.
