package com.raithavarta.data

import com.raithavarta.models.Crop

val SAMPLE_CROPS = listOf(
    Crop(
        id = "1",
        name = "Paddy",
        variety = "IR-64",
        plantingDate = "2024-03-12",
        area = "2.5 Acres",
        healthScore = 92,
        status = "Healthy",
        lastCheck = "Today",
        image = "https://images.unsplash.com/photo-1594488651083-29a1ee1d707c?q=80&w=800&auto=format&fit=crop",
        location = "Field Alpha"
    ),
    Crop(
        id = "2",
        name = "Tomato",
        variety = "Arka Rakshak",
        plantingDate = "2024-04-01",
        area = "1.0 Acre",
        healthScore = 65,
        status = "Risk Detected",
        lastCheck = "2 days ago",
        image = "https://images.unsplash.com/photo-1518977676601-b53f02bad6d5?q=80&w=800&auto=format&fit=crop",
        location = "Field Beta"
    ),
    Crop(
        id = "3",
        name = "Coconut",
        variety = "West Coast Tall",
        plantingDate = "2018-05-20",
        area = "5.0 Acres",
        healthScore = 98,
        status = "Excellent",
        lastCheck = "Last month",
        image = "https://images.unsplash.com/photo-1543158266-0066955047b1?q=80&w=800&auto=format&fit=crop",
        location = "Palm Grove"
    )
)

val CROP_LIST = SAMPLE_CROPS

data class AgriTip(
    val id: String,
    val title: String,
    val description: String,
    val imageUrl: String
)

val AGRI_TIPS = listOf(
    AgriTip(
        "1",
        "Neem Oil Solution",
        "Mix 5ml neem oil in 1L water to prevent aphids naturally.",
        "https://images.unsplash.com/photo-1592982537447-6f2a6a0c3c1b"
    ),
    AgriTip(
        "2",
        "Crop Rotation",
        "Rotate legumes with cereals to fix nitrogen in the soil.",
        "https://images.unsplash.com/photo-1591857177580-dc32d7abc496"
    )
)

data class EPaper(
    val id: String,
    val name: String,
    val language: String,
    val icon: String
)

val E_PAPERS = listOf(
    EPaper("1", "Udayavani", "Kannada", "📰"),
    EPaper("2", "Vijaya Karnataka", "Kannada", "🗞️"),
    EPaper("3", "Dainik Jagran", "Hindi", "📑")
)
