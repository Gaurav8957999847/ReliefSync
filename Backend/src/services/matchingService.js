import volunteerRepository from "../repositories/volunteerRepository.js";

class MatchingService {
  async findBestMatches(need, limit = 5) {
    if (!need || !need.extractedData) {
      return [];
    }

    const { requiredSkills = [], location } = need.extractedData;

    // Get all active & available volunteers of this NGO
    const volunteers = await volunteerRepository.findByNgoId(need.ngoId);

    const scored = volunteers
      .filter((v) => v.availability === "available" && v.isActive === true)
      .map((volunteer) => {
        let score = 0;

        // Skill matching (25 points per matched skill)
        const volSkills = volunteer.skills || [];
        let matchedSkills = 0;

        requiredSkills.forEach((reqSkill) => {
          const match = volSkills.some(
            (vSkill) =>
              vSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
              reqSkill.toLowerCase().includes(vSkill.toLowerCase()),
          );
          if (match) matchedSkills++;
        });

        score += matchedSkills * 25;

        // Location match (30 points)
        if (location && volunteer.location) {
          const locMatch =
            volunteer.location.toLowerCase().includes(location.toLowerCase()) ||
            location.toLowerCase().includes(volunteer.location.toLowerCase());
          if (locMatch) score += 30;
        }

        // Availability bonus
        score += 20;

        return {
          volunteer: {
            _id: volunteer._id,
            name: volunteer.name,
            email: volunteer.email,
            phone: volunteer.phone,
            skills: volunteer.skills,
            location: volunteer.location,
            availability: volunteer.availability,
          },
          matchScore: score,
          matchedSkillsCount: matchedSkills,
        };
      });

    // Sort by score descending and limit results
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return scored.slice(0, limit);
  }
}

export default new MatchingService();
