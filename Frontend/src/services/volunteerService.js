import volunteerRepository from "../repositories/volunteerRepository.js";

class VolunteerService {
  async createVolunteer(volunteerData, ngoId) {
    const data = { ...volunteerData, ngoId };
    return await volunteerRepository.create(data);
  }

  async getAllVolunteers(ngoId) {
    return await volunteerRepository.findByNgoId(ngoId);
  }

  async getVolunteerById(id, ngoId) {
    const volunteer = await volunteerRepository.findById(id, ngoId);
    if (!volunteer) throw new Error("Volunteer not found");
    return volunteer;
  }

  async updateVolunteer(id, ngoId, updateData) {
    const volunteer = await volunteerRepository.update(id, ngoId, updateData);
    if (!volunteer) throw new Error("Volunteer not found");
    return volunteer;
  }
}

export default new VolunteerService();
