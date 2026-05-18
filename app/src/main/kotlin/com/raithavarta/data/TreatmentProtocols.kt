package com.raithavarta.data

data class TreatmentStep(
    val day: Int,
    val task: String,
    val description: String
)

data class Protocol(
    val name: String,
    val cropType: String,
    val steps: List<TreatmentStep>
)

val TREATMENT_PROTOCOLS = listOf(
    Protocol(
        "Organic Paddy Recovery",
        "Paddy",
        listOf(
            TreatmentStep(1, "Deep Water management", "Drain the field completely for 2 days."),
            TreatmentStep(3, "Neem Spray", "Apply 3% neem oil solution in the evening."),
            TreatmentStep(5, "Bio-fertilizer", "Apply Azospirillum at 5kg/ha mixed with FYM."),
            TreatmentStep(10, "Monitoring", "Check for new pest emergence on leaf undersides.")
        )
    ),
    Protocol(
        "Tomato Blight Shield",
        "Tomato",
        listOf(
            TreatmentStep(1, "Pruning", "Remove and burn infected lower leaves."),
            TreatmentStep(2, "Copper Spray", "Spray Copper Oxychloride 3g/L."),
            TreatmentStep(7, "Trichoderma", "Soil application of Trichoderma viride.")
        )
    )
)
