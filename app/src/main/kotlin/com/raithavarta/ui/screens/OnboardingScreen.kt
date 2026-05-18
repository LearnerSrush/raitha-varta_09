package com.raithavarta.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.raithavarta.ui.components.ActionButton
import com.raithavarta.ui.theme.RaithaVartaShapes

data class OnboardingPage(
    val title: String,
    val description: String,
    val icon: ImageVector,
    val color: Color,
    val accent: Color
)

@Composable
fun OnboardingScreen(onComplete: () -> Unit) {
    var currentPage by remember { mutableIntStateOf(0) }
    
    val pages = listOf(
        OnboardingPage(
            "Welcome to Raitha-Varta",
            "Your smart AI companion for modern farming. Let's explore how we can help you grow better.",
            Icons.Default.Star,
            Color(0xFFFFFBEB),
            Color(0xFFD97706)
        ),
        OnboardingPage(
            "AI Disease Detection",
            "Scan your crops with AI to identify diseases instantly and get treatment advice.",
            Icons.Default.Search,
            Color(0xFFF0FDF4),
            Color(0xFF16A34A)
        ),
        OnboardingPage(
            "Daily Advisories",
            "Receive expert tips and weather alerts tailored for your specific crops and region.",
            Icons.Default.Message,
            Color(0xFFEFF6FF),
            Color(0xFF2563EB)
        ),
        OnboardingPage(
            "Hands-Free Farming",
            "Manage your fields using simple voice commands. Just talk to your farm assistant.",
            Icons.Default.Mic,
            Color(0xFFEEF2FF),
            Color(0xFF4F46E5)
        )
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Main Content Area
        Box(modifier = Modifier.weight(1f), contentAlignment = Alignment.Center) {
            AnimatedContent(
                targetState = currentPage,
                transitionSpec = {
                    fadeIn() + slideInHorizontally { it } togetherWith fadeOut() + slideOutHorizontally { -it }
                },
                label = "OnboardingContent"
            ) { index ->
                val page = pages[index]
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.padding(16.dp)
                ) {
                    // Icon Container
                    Surface(
                        modifier = Modifier
                            .size(160.dp)
                            .padding(bottom = 48.dp),
                        shape = RaithaVartaShapes.extraLarge,
                        color = page.color
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = page.icon,
                                contentDescription = null,
                                modifier = Modifier.size(64.dp),
                                tint = page.accent
                            )
                        }
                    }

                    Text(
                        text = page.title,
                        style = MaterialTheme.typography.displayLarge,
                        textAlign = TextAlign.Center,
                        color = Color(0xFF18181B)
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = page.description,
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center,
                        color = Color.Gray,
                        modifier = Modifier.padding(horizontal = 24.dp)
                    )
                }
            }
        }

        // Footer Area
        Column(
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Dots Indicator
            Row(
                modifier = Modifier.padding(bottom = 48.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                pages.forEachIndexed { index, _ ->
                    val width = if (index == currentPage) 32.dp else 8.dp
                    val color = if (index == currentPage) pages[currentPage].accent else Color(0xFFE4E4E7)
                    Box(
                        modifier = Modifier
                            .height(6.dp)
                            .width(width)
                            .background(color, CircleShape)
                    )
                }
            }

            // Buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                TextButton(onClick = onComplete) {
                    Text(
                        "SKIP", 
                        style = MaterialTheme.typography.labelSmall,
                        color = Color.Gray
                    )
                }

                ActionButton(
                    text = if (currentPage == pages.size - 1) "GET STARTED" else "NEXT",
                    containerColor = pages[currentPage].accent,
                    onClick = {
                        if (currentPage < pages.size - 1) {
                            currentPage++
                        } else {
                            onComplete()
                        }
                    }
                )
            }
        }
    }
}
