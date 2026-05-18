package com.raithavarta.data

import com.raithavarta.models.Crop
import com.raithavarta.service.FirebaseManager
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.delay

class CropRepository(private val firebaseManager: FirebaseManager) {
    
    fun getCropsFlow(): Flow<List<Crop>> = flow {
        while(true) {
            val crops = firebaseManager.getCrops()
            emit(crops)
            delay(30000) // Poll every 30 seconds as a simple "real-time" sync
        }
    }

    suspend fun addNewCrop(crop: Crop) {
        firebaseManager.addCrop(crop)
    }
}
