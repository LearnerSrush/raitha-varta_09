

<div align="center">

## 📱 Developed Using Android Studio

<img src="https://upload.wikimedia.org/wikipedia/commons/9/92/Android_Studio_Trademark.svg" width="120" alt="Android Studio Logo"/>

</div>

# 📱 Download APK

[Download Raitha-Varta APK](https://github.com/LearnerSrush/Raitha-Varta/raw/main/Raitha-Varta.apk)


---

# 📌 Internship Project

- **Project Name:** Raitha-Varta  
- **Domain:** Android App Development using Generative AI  
- **Company:** MindMatrix  
- **Developed By:** Srushti EB  
- **College:** Alva's Institute of Engineering and Technology  
- **Technologies Used:** Kotlin, React, TypeScript, Gemini AI, Jetpack Compose, UI/UX Design  

---

# 🚀 Features

- 🌱 AI-based farmer assistance
- 📷 Crop image analysis
- 🤖 Gemini AI integration
- 🌦 Agriculture support system
- 📱 Android application using Kotlin
- 🎨 Modern UI/UX design
- ⚡ Fast frontend development using React + Vite
- 🔥 JSON Server support for local API
- 🌐 Emulator and localhost support
- 📡 Real-time API integration
- 🧠 Smart AI response generation

---

# 🛠 Tech Stack

## Frontend
- React
- Vite
- TypeScript
- HTML5
- CSS3

## Android Development
- Kotlin
- Android Studio
- Jetpack Compose
- Android SDK

## Backend / API
- JSON Server
- Gemini API

## UI/UX
- Material UI
- Responsive Design
- Mobile-Friendly Interface

## Tools
- Node.js
- npm
- Git & GitHub
- VS Code

---

# ▶️ Run Locally

## ✅ Prerequisites

Install the following before running the project:

- Node.js
- npm
- Android Studio
- Android Emulator
- Kotlin Support Plugin

---

# Step 1: Install Dependencies

```bash
npm install
```

---

# Step 2: Create Environment File

Create a file named:

```bash
.env.local
```

Add your Gemini API Key:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

# Step 3: Run JSON Server (Important)

If the emulator is not fetching data properly or sync issues occur, run JSON Server.

Install JSON Server globally:

```bash
npm install -g json-server
```

Start JSON Server:

```bash
json-server --watch db.json --port 3001
```

---

# Step 4: Start Development Server

```bash
npm run dev
```

---

# 📱 Android Emulator Fix

If localhost is not working inside the Android Emulator:

Use:

```bash
http://10.0.2.2:5173
```

Instead of:

```bash
http://localhost:5173
```

Because Android Emulator cannot access localhost directly.

---

# 🔧 Emulator / Sync Error Fix

If the application is not running in emulator or Gradle sync error occurs:

## Clear Cache

```bash
Remove-Item ".gradle" -Recurse -Force
Remove-Item "build" -Recurse -Force
```

---

## Reinstall Dependencies

```bash
npm install
```

---

## Run JSON Server Again

```bash
json-server --watch db.json --port 3001
```

---

## Start Project

```bash
npm run dev -- --host
```

---

# ⭐ GitHub Topics

```text
android
kotlin
jetpack-compose
react
vite
typescript
ui-ux
genai
gemini-api
farmers
ai
internship-project
```

---

# 📄 License

This project is developed for educational and internship purposes.

---

# 🙌 Acknowledgement

Special thanks to MindMatrix for providing the opportunity to work on Android App Development using Generative AI technologies.
