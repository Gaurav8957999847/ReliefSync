import Need from "../models/Need.js";

class NeedRepository {
  async create(needData) {
    return await Need.create(needData);
  }

  async findByNgoId(ngoId) {
    return await Need.find({ ngoId }).sort({ createdAt: -1 });
  }

  async findById(id, ngoId) {
    return await Need.findOne({ _id: id, ngoId });
  }

  // New method - used when assignment is completed
  async updateStatus(id, ngoId, status) {
    return await Need.findOneAndUpdate(
      { _id: id, ngoId },
      { status },
      { new: true },
    );
  }
}

export default new NeedRepository();
