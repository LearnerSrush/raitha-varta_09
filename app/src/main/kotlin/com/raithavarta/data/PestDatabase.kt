package com.raithavarta.data

data class Pest(
    val id: String,
    val name: String,
    val scientificName: String,
    val symptoms: List<String>,
    val affectedCrops: List<String>,
    val organicTreatment: String,
    val chemicalTreatment: String
)

val PEST_DATABASE = listOf(
    Pest(
        "1",
        "Stem Borer",
        "Scirpophaga incertulas",
        listOf("Dead hearts", "Whiteheads", "Yellowing of leaves"),
        listOf("Paddy", "Maize", "Sorghum"),
        "Release Trichogramma japonicum egg parasitoids.",
        "Apply Carbofuran 3G at 25kg/ha."
    ),
    Pest(
        "2",
        "Fruit Borer",
        "Helicoverpa armigera",
        listOf("Circular holes in fruits", "Internal decay"),
        listOf("Tomato", "Okra", "Cotton"),
        "Use pheromone traps (12 per hectare) to monitor and trap adults.",
        "Spray Chlorantraniliprole 18.5 SC at 150ml/ha."
    ),
    Pest(
        "3",
        "Leaf Folder",
        "Cnaphalocrocis medinalis",
        listOf("White papery streaks", "Folded leaves"),
        listOf("Paddy"),
        "Pass a thorny bush or rope over the crop to dislodge larvae.",
        "Spray Cartap hydrochloride 50 SP at 600g/ha."
    )
)
