import Volunteer from "../models/Volunteer.js";

class VolunteerRepository {
  async create(volunteerData) {
    return await Volunteer.create(volunteerData);
  }

  async findByNgoId(ngoId) {
    return await Volunteer.find({ ngoId, isActive: true });
  }

  async findById(id, ngoId) {
    return await Volunteer.findOne({ _id: id, ngoId, isActive: true });
  }

  async update(id, ngoId, updateData) {
    return await Volunteer.findOneAndUpdate(
      { _id: id, ngoId, isActive: true },
      updateData,
      { new: true, runValidators: true },
    );
  }
}

export default new VolunteerRepository();
