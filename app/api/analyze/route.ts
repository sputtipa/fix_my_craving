import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  const { craving } = await request.json()

  if (!craving) {
    return NextResponse.json({ error: "No craving provided" }, { status: 400 })
  }

  const prompt = `
    You are a helpful nutrition assistant. A user is craving: "${craving}"
    
    Respond ONLY with a valid JSON object in exactly this format, no extra text:
    {
      "food": "name of the food they're craving",
      "calories": estimated calories as a number,
      "serving": "exact serving size e.g. '3 cookies (34g)' or '1 medium bag (57g)'",
      "swap": {
        "name": "a genuinely healthy food that addresses the nutritional deficiency behind the craving, not just a lighter version of the same junk food",
        "amount": "exact amount e.g. '2 squares of dark chocolate 70%+ (20g)' or '1 handful of almonds (28g)'",
        "calories": its calories as a number,
        "reason": "one sentence explaining WHY this specific food addresses the nutritional need behind the craving e.g. 'Almonds are rich in magnesium which your body is likely signaling it needs'"
      },
      "why": {
        "reason": "one sentence on the specific nutrient deficiency or biological signal behind this craving e.g. 'Chocolate cravings often signal low magnesium or serotonin from stress or fatigue'",
        "what_body_needs": "the specific nutrient or need e.g. 'magnesium, iron, or a serotonin boost'"
      },
      "burn": {
        "exercise": "one specific exercise e.g. 'brisk walking' or 'jumping rope'",
        "duration": duration in minutes as a number to burn the EXACT calories of the craving (not the swap),
        "intensity": "specific intensity e.g. 'at a pace of 5km/h' or '100 skips per minute'",
        "tip": "one motivating sentence that frames the exercise as the 'cost' of the craving e.g. 'That's 3 Oreos per km walked — worth it?'"
      }
    }
  `

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  })

  const text = (message.content[0] as { type: string; text: string }).text
  const clean = text.replace(/```json|```/g, "").trim()
  const data = JSON.parse(clean)

  return NextResponse.json(data)
}