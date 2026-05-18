package com.raithavarta.service

data class GovtScheme(
    val id: String,
    val title: String,
    val description: String,
    val eligibility: String,
    val benefits: String,
    val link: String
)

class GovtSchemeService {
    fun getRelevantSchemes(cropType: String): List<GovtScheme> {
        return listOf(
            GovtScheme(
                "SMAM",
                "Sub-Mission on Agricultural Mechanization",
                "Subsidy for tractors, tillers and other farm machinery.",
                "Small and marginal farmers.",
                "40% to 50% subsidy on equipment.",
                "https://agrimachinery.nic.in/"
            ),
            GovtScheme(
                "PKVY",
                "Paramparagat Krishi Vikas Yojana",
                "Promoting organic farming through cluster approach.",
                "Groups of farmers with minimum 50 acres.",
                "Financial assistance for organic inputs.",
                "https://dap.dac.gov.in/"
            )
        )
    }
}
