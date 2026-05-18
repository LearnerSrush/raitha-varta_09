# Raitha-Varta Android Architecture Documentation

This document outlines the native Android implementation details for Raitha-Varta.

## 1. MVVM Architecture Design

The app follows the standard Android MVVM (Model-View-ViewModel) pattern with Clean Architecture principles.

- **UI Layer (Activity/Fragment)**: Observes StateFlow/LiveData from ViewModels.
- **ViewModel Layer**: Handles business logic using Coroutines and maintains UI State.
- **Repository Interface**: Abstracts data sources (Room DB + Gemini Remote).
- **Data Layer (DTOs & Entities)**: Room Entities for offline persistence and Retrofit/Firebase for remote.

## 2. Room Database Schema (SQLite)

### Tips Table
```kotlin
@Entity(tableName = "tips")
data class TipEntity(
    @PrimaryKey val id: String,
    val titleEn: String,
    val titleKn: String,
    val titleHi: String,
    val descEn: String,
    val descKn: String,
    val descHi: String,
    val imageUrl: String,
    val dosage: String,
    val createdAt: Long
)
```

### User Dashboard Data
```kotlin
@Entity(tableName = "user_crops")
data class CropEntity(
    @PrimaryKey val id: String,
    val type: String,
    val healthScore: Int,
    val riskLevel: String,
    val lastSync: Long
)
```

## 3. 6-Week Development Roadmap

| Week | Phase | Deliverables |
|:---|:---|:---|
| **1** | Foundational Setup | Multi-language localization system, Navigation (Bottom Nav), Splash Screen. |
| **2** | Local Storage | Room DB Implementation, Repository pattern, Offline-first Tip caching. |
| **3** | AI Core | Gemini API Integration (Vertex AI SDK), Camera interface for Crop Scan. |
| **4** | UI Polish | ViewPager2 for Flashcards, Weather API integration, Alert System. |
| **5** | Admin Features | PDF Parsing with AI, Multi-lingual content generation pipeline. |
| **6** | QA & Deployment | Performance profiling, Voice Assistant fine-tuning, Play Store Beta. |

## 4. Key GenAI Prompts

### Crop Disease Detection
> "Act as a professional agronomist. Identify crop disease from this image. Output in JSON: {disease: string, severity: 'Low'|'Medium'|'High', organic_fix: string, chemical_fix: string}."

### Advisory-to-Tip Conversion
> "Summarize this long advisory text into a single 2-line actionable tip for farmers. Provide output in English, Kannada, and Hindi. Keep the language simple and technical dosages precise."
