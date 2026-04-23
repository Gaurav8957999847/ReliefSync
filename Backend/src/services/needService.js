import needRepository from "../repositories/needRepository.js";
import ngoRepository from "../repositories/ngoRepository.js";
import volunteerRepository from "../repositories/volunteerRepository.js";
import aiService from "./aiService.js";
import crypto from "crypto";
import emailService from "./emailService.js";

// In-memory cache: key = hash of rawText, value = priority
const priorityCache = new Map();

class NeedService {
  async calculatePriority(report) {
    // 1. Create cache key from rawText
    const cacheKey = crypto
      .createHash("sha256")
      .update(report.rawText || "")
      .digest("hex");

    // 2. Check cache first
    if (priorityCache.has(cacheKey)) {
      console.log(`✅ Cache hit for report ${report._id}`);
      return priorityCache.get(cacheKey);
    }

    try {
      const prompt = `
You are a highly experienced Disaster Relief Coordinator with 15+ years working with NGOs in India (especially Uttar Pradesh and Bihar).

Analyze the community report below and decide the **correct urgency priority** for immediate volunteer deployment.

Key factors to consider:
- Number of people affected and their vulnerability (children, elderly, women, disabled, etc.)
- Severity of the crisis (flood, fire, medical emergency, starvation, shelter loss, disease outbreak, etc.)
- Whether lives are in immediate danger right now
- How fast the situation is worsening
- Location risk and accessibility
- Resources and skills needed

Priority Levels (be strict and realistic):
- **critical** → Life-threatening or immediate danger. People trapped, severe injuries, no food/water for many hours, active disaster. Must act within hours.
- **high**     → Very urgent. Large number of people suffering badly. Should be addressed within 24 hours.
- **medium**   → Important need but not life-threatening. Can wait 2–3 days.
- **low**      → Routine or non-urgent help.

Report Details:
Title: ${report.title}
Raw Text: ${report.rawText}
AI Extracted Data: ${JSON.stringify(report.aiExtractedData || {}, null, 2)}

Return **ONLY ONE WORD**: critical, high, medium, or low.
No explanation.

Priority level:`;

      const response = await aiService.extractStructuredData(prompt); // Reusing OpenAI

      let priorityText =
        typeof response === "string" ? response : JSON.stringify(response);

      priorityText = priorityText.toLowerCase().trim();

      let priority = "low";
      if (priorityText.includes("critical")) priority = "critical";
      else if (priorityText.includes("high")) priority = "high";
      else if (priorityText.includes("medium")) priority = "medium";

      // Save to cache
      priorityCache.set(cacheKey, priority);
      console.log(
        `✅ Gemini/OpenAI priority calculated and cached for report ${report._id}`,
      );

      return priority;
    } catch (err) {
      console.error("AI priority failed, using fallback:", err.message);

      // Fallback
      const hint = (report.aiExtractedData?.urgencyHint || "").toLowerCase();
      let priority = "low";
      if (
        hint.includes("critical") ||
        hint.includes("very high") ||
        hint.includes("urgent")
      )
        priority = "critical";
      else if (hint.includes("high")) priority = "high";
      else if (hint.includes("medium")) priority = "medium";

      priorityCache.set(cacheKey, priority);
      return priority;
    }
  }

  async createNeedFromReport(report) {
    const priority = await this.calculatePriority(report);

    const needData = {
      reportId: report._id,
      title: report.title,
      ngoId: report.ngoId,
      extractedData: report.aiExtractedData,
      priority,
      status: "pending",
    };
    // adding the email service here
    const need = await needRepository.create(needData);

    // 🔥 Send Critical Need Alert to the actual NGO email
    try {
      const ngo = await ngoRepository.findById(report.ngoId);
      if (ngo && ngo.email) {
        await emailService.sendCriticalNeedAlert(need, ngo.email);
        console.log(`🚨 Critical need alert sent to NGO: ${ngo.email}`);
      }
    } catch (err) {
      console.error("Failed to send critical need alert:", err.message);
    }

    return need;
  }

  async getAllNeeds(ngoId) {
    return await needRepository.findByNgoId(ngoId);
  }

  async getNeedById(id, ngoId) {
    const need = await needRepository.findById(id, ngoId);
    if (!need) throw new Error("Need not found");
    return need;
  }
}

export default new NeedService();
