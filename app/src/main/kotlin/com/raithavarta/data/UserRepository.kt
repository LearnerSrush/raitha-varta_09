package com.raithavarta.data

import com.raithavarta.models.Crop
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class UserRepository {
    fun getUserCrops(userId: String): Flow<List<Crop>> = flow {
        // Mocking a database fetch
        emit(CROP_LIST)
    }

    suspend fun saveCrop(userId: String, crop: Crop) {
        // Logic to save to local Room DB or Firestore
    }

    suspend fun syncWithCloud(userId: String) {
        // Logic to push local changes to Firestore
    }
}
