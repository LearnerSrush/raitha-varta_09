package com.raithavarta

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.compose.runtime.*
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.lifecycle.viewmodel.compose.viewModel
import com.raithavarta.ui.navigation.RaithaVartaNavigation
import com.raithavarta.ui.navigation.Screen
import com.raithavarta.ui.theme.RaithaVartaTheme
import com.raithavarta.viewmodel.MainViewModel

/**
 * Raitha-Varta Android Main Activity
 * 
 * This project has been migrated to a native Kotlin/Jetpack Compose architecture.
 * Most business logic, models, and UI components are now implemented in Kotlin
 * to provide a high-performance, native experience for farmers.
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RaithaVartaTheme {
                Surface(
                    modifier = Modifier.fillMaxSize()
                ) {
                    val navController = rememberNavController()
                    val viewModel: MainViewModel = viewModel()
                    var showOnboarding by remember { mutableStateOf(true) }
                    
                    RaithaVartaNavigation(
                        navController = navController,
                        startDestination = if (showOnboarding) Screen.Onboarding.route else Screen.Home.route,
                        viewModel = viewModel
                    )
                }
            }
        }
    }
}
