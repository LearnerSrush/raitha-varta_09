package com.raithavarta.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.shape.RoundedCornerShape

// Defining the Raitha-Varta Color Palette
val PrimaryGreen = Color(0xFF16A34A)
val SecondaryIndigo = Color(0xFF4F46E5)
val SurfaceDark = Color(0xFF18181B)
val TextGray = Color(0xFF71717A)

private val DarkColorScheme = darkColorScheme(
    primary = PrimaryGreen,
    secondary = SecondaryIndigo,
    surface = SurfaceDark,
    background = Color.Black
)

private val LightColorScheme = lightColorScheme(
    primary = PrimaryGreen,
    secondary = SecondaryIndigo,
    surface = Color.White,
    background = Color(0xFFFAFAFA)
)

val RaithaVartaTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Black,
        fontSize = 32.sp,
        letterSpacing = (-1).sp
    ),
    titleLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Bold,
        fontSize = 20.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp,
        lineHeight = 20.sp
    ),
    labelSmall = TextStyle(
        fontFamily = FontFamily.Monospace,
        fontWeight = FontWeight.ExtraBold,
        fontSize = 10.sp,
        letterSpacing = 1.sp
    )
)

val RaithaVartaShapes = Shapes(
    extraLarge = RoundedCornerShape(32.dp),
    large = RoundedCornerShape(24.dp),
    medium = RoundedCornerShape(16.dp)
)

@Composable
fun RaithaVartaTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = RaithaVartaTypography,
        shapes = RaithaVartaShapes,
        content = content
    )
}
