import Assignment from "../models/Assignment.js";

class AssignmentRepository {
  async create(assignmentData) {
    return await Assignment.create(assignmentData);
  }

  async findByNgoId(ngoId) {
    return await Assignment.find({ ngoId })
      .populate("needId")
      .populate("volunteerId")
      .sort({ createdAt: -1 });
  }

  async findById(id, ngoId) {
    return await Assignment.findOne({ _id: id, ngoId })
      .populate("needId")
      .populate("volunteerId");
  }

  async updateStatus(id, ngoId, status, notes = "") {
    return await Assignment.findOneAndUpdate(
      { _id: id, ngoId },
      { status, notes },
      { new: true },
    );
  }
}
//sending the instance of the class
export default new AssignmentRepository();
