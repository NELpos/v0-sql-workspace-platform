import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { message, context, files = [], mode } = await req.json()

    console.log("[v0] AI API called with mode:", mode)
    console.log("[v0] Message:", message)

    let fileContextSection = ""
    if (files.length > 0) {
      fileContextSection =
        "\n\nReferenced Files:\n" +
        files
          .map((file: { name: string; content: string }) => {
            const extension = file.name.split(".").pop()
            return `\nFile: ${file.name}\n\`\`\`${extension}\n${file.content}\n\`\`\``
          })
          .join("\n")
    }

    const systemPrompt =
      mode === "agent"
        ? `You are an expert code assistant. Generate code or content based on the user's request.
Return ONLY the code or content without explanations, markdown formatting, or code blocks.
The response will be directly inserted into the file.

${context ? `Current file content:\n${context}` : ""}`
        : `You are an expert SQL assistant helping users with Snowflake queries. 
You can help with:
- Writing and optimizing SQL queries
- Explaining query results
- Debugging SQL errors
- Suggesting best practices
- Performance optimization

${context ? `Current query context:\n${context}` : ""}${fileContextSection}

When files are referenced with @ mentions, use their content to provide more accurate and contextual answers.
Provide clear, concise answers focused on SQL and database topics.`

    try {
      console.log("[v0] Attempting AI generation...")

      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      })

      console.log("[v0] AI response generated successfully")
      return Response.json({ response: text })
    } catch (aiError: any) {
      console.error("[v0] AI generation error:", aiError)

      let fallbackResponse: string

      if (mode === "agent") {
        // Agent mode fallback - provide template code
        fallbackResponse = `// AI service temporarily unavailable
// Here's a template to get you started:

${context || "// Add your code here"}

// Please try again later or use Chat mode for assistance`
      } else {
        // Chat mode fallback - provide helpful message based on query
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes("select") || lowerMessage.includes("query")) {
          fallbackResponse = `I apologize, but I'm having trouble connecting to the AI service right now.

However, here are some general SQL tips:
- Use SELECT to retrieve data from tables
- Add WHERE clauses to filter results
- Use JOIN to combine data from multiple tables
- Consider using LIMIT to restrict result size

Please try again in a moment, or check your query syntax manually.`
        } else if (lowerMessage.includes("error") || lowerMessage.includes("debug")) {
          fallbackResponse = `I'm currently unable to connect to the AI service to help debug your error.

Common SQL debugging steps:
1. Check for syntax errors (missing commas, parentheses)
2. Verify table and column names exist
3. Check data types match in comparisons
4. Review JOIN conditions

Please try again shortly.`
        } else {
          fallbackResponse = `I apologize, but I'm having trouble connecting to the AI service right now. 

The AI assistant helps with:
- Writing SQL queries
- Optimizing performance
- Debugging errors
- Explaining results

Please try again in a moment.`
        }
      }

      return Response.json({
        response: fallbackResponse,
        warning: "AI service temporarily unavailable",
      })
    }
  } catch (error: any) {
    console.error("[v0] AI chat error:", error)
    return Response.json(
      {
        error: "Failed to process request",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
