import CommunityReport from "../models/CommunityReport.js";

class CommunityReportRepository {
  async create(reportData) {
    return await CommunityReport.create(reportData);
  }

  async findByNgoId(ngoId) {
    return await CommunityReport.find({ ngoId }).sort({ createdAt: -1 });
  }

  async findById(id, ngoId) {
    return await CommunityReport.findOne({ _id: id, ngoId });
  }
}

export default new CommunityReportRepository();
