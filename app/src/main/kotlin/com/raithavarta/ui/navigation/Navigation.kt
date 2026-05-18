package com.raithavarta.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.navArgument
import com.google.gson.Gson
import com.raithavarta.models.Crop
import com.raithavarta.models.UserProfile
import com.raithavarta.ui.screens.*
import com.raithavarta.viewmodel.MainViewModel

sealed class Screen(val route: String) {
    object Onboarding : Screen("onboarding")
    object Home : Screen("home")
    object Crops : Screen("crops")
    object Scan : Screen("scan")
    object Profile : Screen("profile")
    object Alerts : Screen("alerts")
    object CropDetail : Screen("cropDetail/{cropJson}") {
        fun createRoute(crop: Crop) = "cropDetail/${Gson().toJson(crop)}"
    }
}

@Composable
fun RaithaVartaNavigation(
    navController: NavHostController,
    startDestination: String,
    viewModel: MainViewModel
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Onboarding.route) {
            OnboardingScreen(onComplete = {
                navController.navigate(Screen.Home.route) {
                    popUpTo(Screen.Onboarding.route) { inclusive = true }
                }
            })
        }
        
        composable(Screen.Home.route) {
            HomeScreen(
                viewModel = viewModel,
                onNavigateToCrops = { navController.navigate(Screen.Crops.route) },
                onNavigateToScan = { navController.navigate(Screen.Scan.route) },
                onNavigateToProfile = { navController.navigate(Screen.Profile.route) },
                onNavigateToAlerts = { navController.navigate(Screen.Alerts.route) }
            )
        }
        
        composable(Screen.Crops.route) {
            CropsScreen(
                viewModel = viewModel,
                onCropClick = { crop ->
                    navController.navigate(Screen.CropDetail.createRoute(crop))
                }
            )
        }
        
        composable(Screen.Scan.route) {
            ScanScreen(onResult = { result ->
                // Handle result
            })
        }
        
        composable(Screen.Profile.route) {
            val sampleProfile = UserProfile(
                uid = "123",
                name = "Harish Gowda",
                location = "Mandya, Karnataka",
                primaryCrop = "Sugarcane",
                language = viewModel.language.value.name.lowercase(),
                theme = "light"
            )
            ProfileScreen(profile = sampleProfile, onBack = { navController.popBackStack() })
        }
        
        composable(Screen.Alerts.route) {
            AlertsScreen(onBack = { navController.popBackStack() })
        }
        
        composable(
            route = Screen.CropDetail.route,
            arguments = listOf(navArgument("cropJson") { type = NavType.StringType })
        ) { backStackEntry ->
            val cropJson = backStackEntry.arguments?.getString("cropJson")
            val crop = Gson().fromJson(cropJson, Crop::class.java)
            CropDetailScreen(viewModel = viewModel, crop = crop, onBack = { navController.popBackStack() })
        }
    }
}

