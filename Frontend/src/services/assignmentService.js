import assignmentRepository from "../repositories/assignmentRepository.js";
import volunteerRepository from "../repositories/volunteerRepository.js";
import emailService from "./emailService.js";

class AssignmentService {
  async createAssignment(needId, volunteerId, assignedBy, ngoId) {
    const data = {
      needId,
      volunteerId,
      ngoId,
      assignedBy,
      status: "assigned",
    };
    const assignment = await assignmentRepository.create(data);

    // 🔥 Send email to the actual Volunteer
    try {
      const volunteer = await volunteerRepository.findById(volunteerId, ngoId);

      if (volunteer && volunteer.email) {
        await emailService.sendAssignmentAlert(
          volunteer.email,
          assignment.needId?.title || "New Task",
        );
        console.log(
          `📧 Assignment alert sent to volunteer: ${volunteer.email}`,
        );
      } else {
        console.warn("⚠️ Volunteer email not found");
      }
    } catch (err) {
      console.error("Failed to send assignment alert:", err.message);
    }

    return assignment;
  }

  async getAllAssignments(ngoId) {
    return await assignmentRepository.findByNgoId(ngoId);
  }

  async getAssignmentById(id, ngoId) {
    const assignment = await assignmentRepository.findById(id, ngoId);
    if (!assignment) throw new Error("Assignment not found");
    return assignment;
  }

  async updateAssignmentStatus(id, ngoId, status, notes = "") {
    const assignment = await assignmentRepository.updateStatus(
      id,
      ngoId,
      status,
      notes,
    );
    if (!assignment) throw new Error("Assignment not found");
    return assignment;
  }
}
//sending the instance of the class
export default new AssignmentService();
