import summaryService from "../services/summaryService.js";
import needRepository from "../repositories/needRepository.js";

const generateSummary = async (req, res, next) => {
  try {
    const { needId } = req.body;
    const ngoId = req.user.ngoId;

    const need = await needRepository.findById(needId, ngoId);
    if (!need) {
      return res
        .status(404)
        .json({ success: false, message: "Need not found" });
    }

    const summary = await summaryService.createSummary(need);

    res.json({
      success: true,
      message: "Readable AI summary generated successfully",
      data: summary,
    });
  } catch (err) {
    next(err);
  }
};

export { generateSummary };
