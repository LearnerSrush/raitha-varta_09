package com.raithavarta.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import com.raithavarta.viewmodel.MainViewModel

@Composable
fun CropsScreen(viewModel: MainViewModel, onCropClick: (Crop) -> Unit) {
    val crops by viewModel.crops.collectAsState()
    val isRefreshing by viewModel.isRefreshing.collectAsState()

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { /* Add New Crop */ },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Crop")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "My Crops",
                        style = MaterialTheme.typography.displaySmall,
                        color = MaterialTheme.colorScheme.primary
                    )
                    
                    if (isRefreshing) {
                        CircularProgressIndicator(modifier = Modifier.size(24.dp))
                    }
                }
            }

            items(crops) { crop ->
                CropItem(crop = crop, onClick = { onCropClick(crop) })
            }
        }
    }
}

@Composable
fun CropItem(crop: Crop, onClick: () -> Unit) {
    AgriCard(
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Crop Image
            AsyncImage(
                model = crop.image,
                contentDescription = crop.name,
                modifier = Modifier
                    .size(80.dp)
                    .padding(end = 16.dp),
                contentScale = ContentScale.Crop
            )

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = crop.name,
                        style = MaterialTheme.typography.titleLarge
                    )
                    
                    val healthColor = when {
                        crop.healthScore >= 90 -> Color(0xFF22C55E)
                        crop.healthScore >= 70 -> Color(0xFFEAB308)
                        else -> Color(0xFFEF4444)
                    }
                    
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.TrendingUp,
                            contentDescription = null,
                            tint = healthColor,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "${crop.healthScore}%",
                            style = MaterialTheme.typography.labelLarge,
                            color = healthColor
                        )
                    }
                }

                Text(
                    text = crop.variety,
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Badge(
                        text = crop.status,
                        containerColor = when (crop.status) {
                            "Healthy" -> Color(0xFFDCFCE7)
                            "Risk Detected" -> Color(0xFFFEF9C3)
                            else -> Color(0xFFF3F4F6)
                        },
                        contentColor = when (crop.status) {
                            "Healthy" -> Color(0xFF166534)
                            "Risk Detected" -> Color(0xFF854D0E)
                            else -> Color(0xFF374151)
                        }
                    )
                    
                    Icon(
                        Icons.Default.ArrowForward,
                        contentDescription = null,
                        tint = Color.LightGray
                    )
                }
            }
        }
    }
}
