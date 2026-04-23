import matchingService from "../services/matchingService.js";
import needRepository from "../repositories/needRepository.js";

const getRecommendedVolunteers = async (req, res, next) => {
  try {
    const { needId } = req.params;
    const ngoId = req.user.ngoId;

    // Get the specific Need
    const need = await needRepository.findById(needId, ngoId);
    if (!need) {
      return res.status(404).json({
        success: false,
        message: "Need not found",
      });
    }

    // Get best matching volunteers
    const recommendations = await matchingService.findBestMatches(need, 5);

    res.json({
      success: true,
      needId: need._id,
      needTitle: need.title,
      priority: need.priority,
      recommendations: recommendations,
    });
  } catch (err) {
    next(err);
  }
};

export { getRecommendedVolunteers };
