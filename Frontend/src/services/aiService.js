import OpenAI from "openai";
import crypto from "crypto";

// In-memory cache: key = hash of rawText, value = extracted JSON
const extractionCache = new Map();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AiService {
  async extractStructuredData(rawText) {
    if (!rawText || rawText.trim() === "") {
      throw new Error("Raw text is empty");
    }

    // 1. Create cache key
    const cacheKey = crypto.createHash("sha256").update(rawText).digest("hex");

    // 2. Check cache first
    if (extractionCache.has(cacheKey)) {
      console.log("✅ AI Extraction Cache HIT");
      return extractionCache.get(cacheKey);
    }

    // 3. If not in cache → call OpenAI
    try {
      const prompt = `
You are an expert data extractor for an NGO disaster relief platform.

Convert the following community report into a clean, structured JSON object.

Report:
${rawText}

Return **only** valid JSON with these exact fields:
{
  "location": "string (city/area/district)",
  "issueType": "string (flood, fire, medical, food shortage, shelter, etc.)",
  "affectedPeople": number,
  "urgencyHint": "string (low | medium | high | critical)",
  "requiredSkills": ["array of skills like first-aid, logistics, doctor, rescue, etc."],
  "requiredVolunteers": number
}

Be accurate and realistic. Do not add any extra text outside the JSON.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      const parsedData = JSON.parse(content);

      // Save to cache
      extractionCache.set(cacheKey, parsedData);
      console.log("✅ AI Extraction completed and cached");

      return parsedData;
    } catch (err) {
      console.error("❌ AI Extraction failed:", err.message);
      throw err;
    }
  }
  // Expose openai instance for other services
  //by default openai instance is considered as private so by this we will make it public so that we can use it outside other files as well 
  get openai() {
    return openai;
  }
}

export default new AiService();
