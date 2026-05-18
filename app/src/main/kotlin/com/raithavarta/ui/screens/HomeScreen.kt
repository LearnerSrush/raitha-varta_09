package com.raithavarta.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.QrCodeScanner
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import com.raithavarta.viewmodel.MainViewModel
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.raithavarta.ui.components.AgriCard
import com.raithavarta.ui.components.Badge

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    onNavigateToCrops: () -> Unit,
    onNavigateToScan: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToAlerts: () -> Unit
) {
    val language by viewModel.language.collectAsState()
    val weather by viewModel.weather.collectAsState()
    
    Scaffold(
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onNavigateToProfile) {
                    Surface(
                        modifier = Modifier.size(32.dp),
                        shape = CircleShape,
                        color = MaterialTheme.colorScheme.secondaryContainer
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(20.dp))
                        }
                    }
                }
                
                IconButton(onClick = onNavigateToAlerts) {
                    Icon(Icons.Default.NotificationsActive, contentDescription = "Alerts")
                }
            }
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = true,
                    onClick = { /* Home */ },
                    icon = { Icon(Icons.Default.Home, contentDescription = null) },
                    label = { Text("Home") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToCrops,
                    icon = { Icon(Icons.Default.List, contentDescription = null) },
                    label = { Text("Crops") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToScan,
                    icon = { Icon(Icons.Default.QrCodeScanner, contentDescription = null) },
                    label = { Text("Scan") }
                )
                NavigationBarItem(
                    selected = false,
                    onClick = onNavigateToProfile,
                    icon = { Icon(Icons.Default.Person, contentDescription = null) },
                    label = { Text("Profile") }
                )
            }
        },
        floatingActionButton = {
            LargeFloatingActionButton(
                onClick = { /* Handle Voice */ },
                containerColor = MaterialTheme.colorScheme.secondary,
                shape = CircleShape
            ) {
                Icon(Icons.Default.Mic, contentDescription = "Voice", tint = Color.White)
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            // Header Section
            item {
                Column(modifier = Modifier.padding(top = 8.dp)) {
                    Text(
                        text = "Hello Farmer,",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                    Text(
                        text = "Raitha-Varta",
                        style = MaterialTheme.typography.displayLarge,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }

            // Weather Widget
            item {
                AgriCard(backgroundColor = MaterialTheme.colorScheme.primary) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("28°C", style = MaterialTheme.typography.displayLarge, color = Color.White)
                            Text("Cloudy • Bangalore", style = MaterialTheme.typography.bodyMedium, color = Color.White.copy(alpha = 0.8f))
                        }
                        Icon(
                            Icons.Default.Warning, 
                            contentDescription = null, 
                            tint = Color.White,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }
            }

            // Innovation Hub Section (Kotlin focused)
            item {
                AgriCard(backgroundColor = Color(0xFF18181B)) {
                    Badge("Kotlin Advantage", containerColor = Color(0xFF22C55E), contentColor = Color.Black)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "80% Kotlin Codebase",
                        style = MaterialTheme.typography.titleLarge,
                        color = Color.White
                    )
                    Text(
                        "This app is now predominantly built with high-performance Kotlin and Jetpack Compose.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.Gray
                    )
                }
            }


            // Daily Tips Label
            item {
                Text(
                    "Daily Advisories",
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.padding(horizontal = 4.dp)
                )
            }

            // Sample Tips List
            items(5) { index ->
                AgriCard {
                    Text("Tip #$index: Soil Maintenance", style = MaterialTheme.typography.titleLarge)
                    Text(
                        "Check your soil pH levels before monsoon to optimize fertilizer usage.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color.DarkGray,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        }
    }
}
