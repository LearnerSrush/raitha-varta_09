# Raitha Varta - Android Integration

This project includes a production-standard Android build system using Gradle KTS.

## How to run in Android Studio

1. **Open Android Studio**: Select "Open" and navigate to this project's root directory.
2. **Gradle Sync**: Android Studio should automatically detect the `build.gradle.kts` files and start a Gradle sync.
3. **Emulator Setup**:
   - Go to `Device Manager`.
   - Create a new Virtual Device (e.g., Pixel 7).
   - Ensure the API level is 24 or higher (Target is 34).
4. **Run Application**: Click the green "Run" button in the toolbar.

## Project Structure (Android)

- `app/build.gradle.kts`: Module-level build configuration.
- `app/src/main/kotlin/com/raithavarta/`: Source code including Jetpack Compose UI.
- `app/src/main/res/`: Android resources (strings, themes, manifests).

## Troubleshooting "Not Running in Local Host"

If you are trying to run the **Web Preview** in this browser environment:
- Ensure you are looking at the Preview tab.
- If the server appears stuck, the agent has recently restarted it to apply fixes.
- The web app runs on port 3000.

## Gemin AI Integration
The app uses Google's Gemini AI for agricultural insights. Ensure the `GEMINI_API_KEY` is set in your environment if running the web version. For Android, you may need to add your API key to a `local.properties` file or secret manager.
