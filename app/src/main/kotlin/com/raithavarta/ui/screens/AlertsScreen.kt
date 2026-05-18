package com.raithavarta.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.SevereCold
import androidx.compose.material.icons.filled.WaterDrop
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.raithavarta.models.WeatherAlert

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlertsScreen(onBack: () -> Unit) {
    val alerts = listOf(
        WeatherAlert(
            type = "rain",
            severity = "high",
            message = com.raithavarta.models.LocalizedString(
                en = "Heavy rain expected tomorrow. Secure your harvest.",
                kn = "ನಾಳೆ ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷೆಯಿದೆ. ನಿಮ್ಮ ಫಸಲನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಿ.",
                hi = "कल भारी बारिश की संभावना है। अपनी फसल सुरक्षित करें।"
            ),
            timestamp = "2 hours ago"
        ),
        WeatherAlert(
            type = "wind",
            severity = "medium",
            message = com.raithavarta.models.LocalizedString(
                en = "Strong winds alert for the weekend.",
                kn = "ವಾರಾಂತ್ಯದಲ್ಲಿ ಬಲವಾದ ಗಾಳಿ ಬೀಸುವ ಸಂಭವವಿದೆ.",
                hi = "सप्ताहांत के लिए तेज हवाओं का अलर्ट।"
            ),
            timestamp = "5 hours ago"
        )
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Alerts") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.padding(padding).fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(alerts) { alert ->
                AlertItem(alert)
            }
        }
    }
}

@Composable
fun AlertItem(alert: WeatherAlert) {
    val backgroundColor = when (alert.severity) {
        "high" -> Color(0xFFFEF2F2)
        "medium" -> Color(0xFFFFFBEB)
        else -> Color(0xFFF0FDF4)
    }
    
    val accentColor = when (alert.severity) {
        "high" -> Color(0xFFEF4444)
        "medium" -> Color(0xFFF59E0B)
        else -> Color(0xFF22C55E)
    }

    Surface(
        color = backgroundColor,
        shape = MaterialTheme.shapes.large,
        border = androidx.compose.foundation.BorderStroke(1.dp, accentColor.copy(alpha = 0.2f))
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            verticalAlignment = Alignment.Top
        ) {
            Icon(
                when (alert.type) {
                    "rain" -> Icons.Default.WaterDrop
                    else -> Icons.Default.NotificationsActive
                },
                contentDescription = null,
                tint = accentColor,
                modifier = Modifier.size(24.dp)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column {
                Text(
                    alert.message.en, // Should use the selected language
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.Black
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    alert.timestamp,
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.Gray
                )
            }
        }
    }
}
