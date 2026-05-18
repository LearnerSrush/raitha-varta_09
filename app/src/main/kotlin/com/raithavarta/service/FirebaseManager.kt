package com.raithavarta.service

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.raithavarta.models.Crop
import kotlinx.coroutines.tasks.await

class FirebaseManager {
    private val auth: FirebaseAuth by lazy { FirebaseAuth.getInstance() }
    private val db: FirebaseFirestore by lazy { FirebaseFirestore.getInstance() }

    val currentUser get() = auth.currentUser

    suspend fun getCrops(): List<Crop> {
        val uid = currentUser?.uid ?: return emptyList()
        return try {
            val snapshot = db.collection("users").document(uid).collection("crops").get().await()
            snapshot.toObjects(Crop::class.java)
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun addCrop(crop: Crop) {
        val uid = currentUser?.uid ?: return
        try {
            db.collection("users").document(uid).collection("crops").add(crop).await()
        } catch (e: Exception) {
            // Log error
        }
    }

    fun signOut() {
        auth.signOut()
    }
}
