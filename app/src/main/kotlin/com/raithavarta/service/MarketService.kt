package com.raithavarta.service

data class MarketPrice(
    val commodity: String,
    val market: String,
    val minPrice: Int,
    val maxPrice: Int,
    val modalPrice: Int,
    val date: String
)

class MarketService {
    fun getPrices(location: String): List<MarketPrice> {
        return listOf(
            MarketPrice("Paddy (Common)", location, 2183, 2300, 2250, "2026-05-18"),
            MarketPrice("Ragi", location, 3846, 4000, 3900, "2026-05-18"),
            MarketPrice("Tomato", location, 1500, 2200, 1800, "2026-05-18")
        )
    }
}
