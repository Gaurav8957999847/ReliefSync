import needService from "../services/needService.js";

const getAllNeeds = async (req, res, next) => {
  try {
    const ngoId = req.user.ngoId;
    const needs = await needService.getAllNeeds(ngoId);

    res.json({
      success: true,
      count: needs.length,
      data: needs,
    });
  } catch (err) {
    next(err);
  }
};

const getNeedById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ngoId = req.user.ngoId;

    const need = await needService.getNeedById(id, ngoId);
    res.json({
      success: true,
      data: need,
    });
  } catch (err) {
    next(err);
  }
};

export { getAllNeeds, getNeedById };
