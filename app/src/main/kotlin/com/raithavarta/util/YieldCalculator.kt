package com.raithavarta.util

object YieldCalculator {
    /**
     * Estimates paddy yield based on tillers and grain weight.
     */
    fun estimatePaddyYield(
        hillCountPerSqm: Int,
        avgTillerCount: Int,
        avgGrainCountPerPanicle: Int,
        testWeightGrams: Float = 25f // 1000 grains weight
    ): Float {
        val totalGrains = hillCountPerSqm * avgTillerCount * avgGrainCountPerPanicle
        return (totalGrains * testWeightGrams) / 1000000f // Return in tonnes per hectare
    }

    /**
     * Calculates required fertilizer amount.
     */
    fun calculateNPK(
        areaAcres: Float,
        cropType: String,
        targetYield: Float
    ): Triple<Float, Float, Float> {
        return when (cropType) {
            "Paddy" -> Triple(areaAcres * 40f, areaAcres * 20f, areaAcres * 20f)
            "Sugarcane" -> Triple(areaAcres * 100f, areaAcres * 50f, areaAcres * 50f)
            else -> Triple(areaAcres * 30f, areaAcres * 15f, areaAcres * 15f)
        }
    }
}
