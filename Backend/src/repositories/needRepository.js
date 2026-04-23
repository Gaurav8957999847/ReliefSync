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
}

export default new NeedRepository();
