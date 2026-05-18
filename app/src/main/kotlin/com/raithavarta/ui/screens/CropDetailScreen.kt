package com.raithavarta.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MonitorHeart
import androidx.compose.material.icons.filled.Timeline
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import com.raithavarta.viewmodel.MainViewModel
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.raithavarta.models.Crop
import com.raithavarta.ui.components.AgriCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CropDetailScreen(viewModel: MainViewModel, crop: Crop, onBack: () -> Unit) {
    val language by viewModel.language.collectAsState()
    var aiAdvice by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf("Analyzing crop status...") }

    androidx.compose.runtime.LaunchedEffect(crop.id) {
        viewModel.getAiAdvice("Status report for ${crop.name} (${crop.variety}) in ${crop.location}", language.name) {
            aiAdvice = it
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(crop.name, style = MaterialTheme.typography.titleLarge) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // Hero Image
            AsyncImage(
                model = crop.image,
                contentDescription = null,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(240.dp),
                contentScale = ContentScale.Crop
            )

            Column(
                modifier = Modifier
                    .padding(16.dp)
                    .fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Quick Stats
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    StatBox(
                        label = "Health",
                        value = "${crop.healthScore}%",
                        icon = Icons.Default.MonitorHeart,
                        color = Color(0xFF22C55E),
                        modifier = Modifier.weight(1f)
                    )
                    StatBox(
                        label = "Area",
                        value = crop.area,
                        icon = Icons.Default.Timeline,
                        color = Color(0xFF3B82F6),
                        modifier = Modifier.weight(1f)
                    )
                }

                // AI Insights
                AgriCard(backgroundColor = Color(0xFFF0FDF4)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            Icons.Default.Info,
                            contentDescription = null,
                            tint = Color(0xFF166534),
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            "AI Diagnostic Report",
                            style = MaterialTheme.typography.titleMedium,
                            color = Color(0xFF166534)
                        )
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        aiAdvice,
                        style = MaterialTheme.typography.bodyMedium,
                        color = Color(0xFF15803D)
                    )
                }

                // Details List
                DetailItem(label = "Variety", value = crop.variety)
                DetailItem(label = "Planting Date", value = crop.plantingDate)
                DetailItem(label = "Location", value = crop.location)
                DetailItem(label = "Last Inspection", value = crop.lastCheck)

                Spacer(modifier = Modifier.height(32.dp))
            }
        }
    }
}

@Composable
fun StatBox(
    label: String,
    value: String,
    icon: ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Surface(
        modifier = modifier,
        shape = MaterialTheme.shapes.large,
        color = color.copy(alpha = 0.1f),
        border = androidx.compose.foundation.BorderStroke(1.dp, color.copy(alpha = 0.2f))
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = value, style = MaterialTheme.typography.headlineSmall, color = color)
            Text(text = label, style = MaterialTheme.typography.labelMedium, color = color.copy(alpha = 0.7f))
        }
    }
}

@Composable
fun DetailItem(label: String, value: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        Text(text = label, style = MaterialTheme.typography.labelMedium, color = Color.Gray)
        Text(text = value, style = MaterialTheme.typography.titleMedium)
        Divider(modifier = Modifier.padding(top = 8.dp), color = Color.LightGray.copy(alpha = 0.5f))
    }
}
