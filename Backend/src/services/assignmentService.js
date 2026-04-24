import assignmentRepository from "../repositories/assignmentRepository.js";
import volunteerRepository from "../repositories/volunteerRepository.js";
import needRepository from "../repositories/needRepository.js";
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

    // Change volunteer to 'on_assignment'
    try {
      await volunteerRepository.update(volunteerId, ngoId, {
        availability: "on_assignment",
      });
    } catch (err) {
      console.error("Failed to update volunteer status:", err.message);
    }

    // Send email to volunteer
    try {
      const volunteer = await volunteerRepository.findById(volunteerId, ngoId);
      if (volunteer && volunteer.email) {
        await emailService.sendAssignmentAlert(
          volunteer.email,
          assignment.needId?.title || "New Task",
        );
      }
    } catch (err) {
      console.error("Failed to send assignment email:", err.message);
    }

    return assignment;
  }

  async updateAssignmentStatus(id, ngoId, status, notes = "") {
    const assignment = await assignmentRepository.updateStatus(
      id,
      ngoId,
      status,
      notes,
    );

    // When assignment is completed → diminish the Need + make volunteer available
    if (status === "completed") {
      try {
        const assignmentData = await assignmentRepository.findById(id, ngoId);

        if (assignmentData && assignmentData.needId) {
          // Diminish the Need (mark as completed)
          await needRepository.updateStatus(
            assignmentData.needId,
            ngoId,
            "completed",
          );
          console.log(`✅ Need marked as completed / diminished`);
        }

        if (assignmentData && assignmentData.volunteerId) {
          // Make volunteer available again
          await volunteerRepository.update(assignmentData.volunteerId, ngoId, {
            availability: "available",
          });
          console.log(`✅ Volunteer status changed back to available`);
        }
      } catch (err) {
        console.error("Failed to update status after completion:", err.message);
      }
    }

    return assignment;
  }

  async getAllAssignments(ngoId) {
    return await assignmentRepository.findByNgoId(ngoId);
  }
}

export default new AssignmentService();
