package com.raithavarta.util

import com.raithavarta.viewmodel.AppLanguage

object LanguageManager {
    private var currentLanguage = AppLanguage.EN

    fun getString(en: String, hi: String, kn: String): String {
        return when (currentLanguage) {
            AppLanguage.EN -> en
            AppLanguage.HI -> hi
            AppLanguage.KN -> kn
        }
    }

    fun setLanguage(language: AppLanguage) {
        currentLanguage = language
    }
    
    fun getCurrent() = currentLanguage
}

fun String.localize(hi: String, kn: String): String {
    return LanguageManager.getString(this, hi, kn)
}
