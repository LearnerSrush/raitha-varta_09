package com.raithavarta.service

data class NewsArticle(
    val id: String,
    val title: String,
    val summary: String,
    val source: String,
    val url: String,
    val imageUrl: String
)

class NewsService {
    fun getAgriNews(): List<NewsArticle> {
        return listOf(
            NewsArticle(
                "1",
                "Monsoon Outlook 2026",
                "Experts predict favorable rainfall for the southern states this year.",
                "AgriPlus",
                "https://example.com/monsoon",
                "https://images.unsplash.com/photo-1594488651083-29a1ee1d707c"
            ),
            NewsArticle(
                "2",
                "New Paddy Subsidies",
                "State government announces 20% increase in subsidies for organic paddy.",
                "Krishi News",
                "https://example.com/subsidy",
                "https://images.unsplash.com/photo-1516912481808-34091f85040d"
            )
        )
    }
}
