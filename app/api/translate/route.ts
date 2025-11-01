import { generateText } from "ai"

// PII detection patterns
const PII_PATTERNS = [
  { name: "Email", pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g },
  { name: "Phone", pattern: /(\+\d{1,3}[-.\s]?)?$$?\d{3}$$?[-.\s]?\d{3}[-.\s]?\d{4}\b/g },
  { name: "SSN", pattern: /\b\d{3}-\d{2}-\d{4}\b/g },
  { name: "Credit Card", pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g },
  {
    name: "Address",
    pattern: /\b\d+\s+[A-Za-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi,
  },
]

function detectPII(text: string): { hasPII: boolean; detectedTypes: string[] } {
  const detectedTypes: string[] = []

  for (const { name, pattern } of PII_PATTERNS) {
    if (pattern.test(text)) {
      detectedTypes.push(name)
    }
  }

  return {
    hasPII: detectedTypes.length > 0,
    detectedTypes,
  }
}

export async function POST(req: Request) {
  try {
    const { text, sourceLang, targetLang } = await req.json()

    if (!text || !targetLang) {
      return Response.json({ error: "Text and target language are required" }, { status: 400 })
    }

    const validLanguages = ["en", "ko"]
    if (!validLanguages.includes(targetLang) || (sourceLang && !validLanguages.includes(sourceLang))) {
      return Response.json({ error: "Only English (en) and Korean (ko) are supported" }, { status: 400 })
    }

    const piiCheck = detectPII(text)
    if (piiCheck.hasPII) {
      return Response.json(
        {
          error: "PII Detected",
          message: `Your text contains potentially sensitive information (${piiCheck.detectedTypes.join(", ")}). Please remove personal information before translating.`,
          detectedTypes: piiCheck.detectedTypes,
        },
        { status: 400 },
      )
    }

    try {
      const sourceLanguage = sourceLang === "en" ? "English" : "Korean"
      const targetLanguage = targetLang === "en" ? "English" : "Korean"

      const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. 
Provide ONLY the translation without any explanations, notes, or additional text.

Text to translate:
${text}`

      const { text: translatedText } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt,
        temperature: 0.3,
      })

      return Response.json({
        translatedText: translatedText.trim(),
        sourceLang,
        targetLang,
      })
    } catch (aiError: any) {
      console.error("[v0] Translation AI error:", aiError)

      return Response.json(
        {
          error: "Translation Failed",
          message: "The translation service is temporarily unavailable. Please try again in a moment.",
          details: aiError?.message || "Unknown error",
        },
        { status: 503 },
      )
    }
  } catch (error: any) {
    console.error("[v0] Translation API error:", error)
    return Response.json(
      {
        error: "Server Error",
        message: "Failed to process translation request",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
