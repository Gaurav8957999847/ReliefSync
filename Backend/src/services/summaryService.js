import aiService from "./aiService.js";
import summaryRepository from "../repositories/summaryRepository.js";
import crypto from "crypto";

// In-memory cache: key = hash of needId, value = generated summary
const summaryCache = new Map();

class SummaryService {
  async generateUrgentNeedSummary(need) {
    // Create cache key
    const cacheKey = crypto
      .createHash("sha256")
      .update(need._id.toString())
      .digest("hex");

    // Check in-memory cache first
    if (summaryCache.has(cacheKey)) {
      console.log(`✅ Summary Cache HIT for need ${need._id}`);
      return summaryCache.get(cacheKey);
    }

    const prompt = `
You are a senior NGO Coordinator writing a clear, professional, and actionable summary for field teams and management.

Write a **concise, easy-to-read summary** (maximum 140 words) for the following urgent need.

Need Details:
- Title: ${need.title}
- Priority: ${need.priority.toUpperCase()}
- AI Extracted Data: ${JSON.stringify(need.extractedData, null, 2)}

Guidelines:
- Start with the most critical information
- Mention location, number of affected people, and type of crisis
- Clearly state what help/skills/resources are urgently needed
- End with a strong call-to-action for volunteers
- Use simple, professional, and compassionate language

Write only the summary. No extra text or explanations.
`;

    try {
      const completion = await aiService.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 300,
      });

      const generatedText = completion.choices[0].message.content.trim();

      // Save to cache
      summaryCache.set(cacheKey, generatedText);
      console.log(`✅ Summary generated and cached for need ${need._id}`);

      return generatedText;
    } catch (err) {
      console.error("Summary generation failed:", err.message);
      throw err;
    }
  }

  async createSummary(need) {
    // First check database (persistent)
    let existing = await summaryRepository.findByNeedId(need._id);
    if (existing) return existing;

    const generatedText = await this.generateUrgentNeedSummary(need);

    const summaryData = {
      reportId: need.reportId,
      needId: need._id,
      ngoId: need.ngoId,
      summaryType: "urgent_need",
      generatedText,
      generatedBy: "openai",
    };

    return await summaryRepository.create(summaryData);
  }
}

export default new SummaryService();
