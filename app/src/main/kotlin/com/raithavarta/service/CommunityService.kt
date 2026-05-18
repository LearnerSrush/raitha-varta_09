package com.raithavarta.service

data class ForumPost(
    val id: String,
    val author: String,
    val content: String,
    val likes: Int,
    val comments: Int,
    val timestamp: String
)

class CommunityService {
    fun getTrendingPosts(): List<ForumPost> {
        return listOf(
            ForumPost("1", "Farmer Ramesh", "Has anyone tried the new drought-resistant paddy variety?", 45, 12, "2h ago"),
            ForumPost("2", "Expert Harish", "Best time for pulse sowing in Southern Karnataka is now.", 120, 34, "5h ago"),
            ForumPost("3", "Suresh Kumar", "Sharing organic pesticide recipe we used in our village.", 89, 56, "Yesterday")
        )
    }
}
