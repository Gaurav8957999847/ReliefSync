import NGO from "../models/NGO.js";

class NgoRepository {
  async create(ngoData) {
    return await NGO.create(ngoData);
  }

  async findById(id) {
    return await NGO.findById(id);
  }

  async findByEmail(email) {
    return await NGO.findOne({ email });
  }
}

export default new NgoRepository();
