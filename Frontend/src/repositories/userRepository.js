import User from "../models/User.js";

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findByEmail(email) {
    return await User.findOne({ email }).populate("ngoId");
  }

  async findById(id) {
    return await User.findById(id).populate("ngoId");
  }

  async findByNgoId(ngoId) {
    return await User.find({ ngoId });
  }
}

export default new UserRepository();
