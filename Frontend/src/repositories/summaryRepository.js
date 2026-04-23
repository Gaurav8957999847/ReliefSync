import SummaryReport from "../models/SummaryReport.js";

class SummaryRepository {
  async create(summaryData) {
    return await SummaryReport.create(summaryData);
  }

  async findByNeedId(needId) {
    return await SummaryReport.findOne({ needId });
  }
}

export default new SummaryRepository();
