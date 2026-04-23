import reportRepository from "../repositories/communityReportRepository.js";
import fs from "fs/promises";
import PDFParser from "pdf2json";
import aiService from "./aiService.js";
import needService from "./needService.js";

class ReportService {
  async createTextReport(reportData, ngoId, userId) {
    const data = {
      ...reportData,
      ngoId,
      submittedBy: userId,
      status: "processed",
    };

    const report = await reportRepository.create(data);
    return await this.runAiExtraction(report);
  }

  async createPdfReport(reportData, ngoId, userId, pdfPath) {
    const data = {
      ...reportData,
      ngoId,
      submittedBy: userId,
      pdfPath,
      status: "processing",
    };

    const report = await reportRepository.create(data);

    // 1. Extract text from PDF
    try {
      const fullPath = pdfPath.startsWith("/") ? pdfPath.slice(1) : pdfPath;
      const buffer = await fs.readFile(fullPath);

      const pdfParser = new PDFParser(null, 1);

      const rawText = await new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", (errData) =>
          reject(errData.parserError),
        );
        pdfParser.on("pdfParser_dataReady", () => {
          resolve(pdfParser.getRawTextContent());
        });
        pdfParser.parseBuffer(buffer);
      });

      report.rawText = rawText.trim();
      report.status = "processed";
      await report.save();

      console.log(`✅ PDF text extracted for report ${report._id}`);
    } catch (extractErr) {
      console.error("❌ PDF extraction failed:", extractErr.message);
      report.status = "raw";
      await report.save();
      return report;
    }

    // 2. Run AI extraction + Need creation
    return await this.runAiExtraction(report);
  }

  async runAiExtraction(report) {
    if (!report.rawText || report.rawText.trim() === "") {
      return report;
    }

    try {
      const extractedData = await aiService.extractStructuredData(
        report.rawText,
      );
      report.aiExtractedData = extractedData;
      await report.save();

      console.log(`✅ AI extraction completed for report ${report._id}`);

      // Automatically create Need (Phase 7)
      await needService.createNeedFromReport(report);
      console.log(`✅ Need created automatically for report ${report._id}`);
    } catch (aiErr) {
      console.error("❌ AI extraction failed:", aiErr.message);
    }

    return report;
  }

  async getAllReports(ngoId) {
    return await reportRepository.findByNgoId(ngoId);
  }

  async getReportById(id, ngoId) {
    const report = await reportRepository.findById(id, ngoId);
    if (!report) throw new Error("Report not found");
    return report;
  }
}

export default new ReportService();
