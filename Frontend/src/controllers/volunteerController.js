import volunteerService from "../services/volunteerService.js";

const createVolunteer = async (req, res, next) => {
  try {
    const volunteerData = req.body;
    const ngoId = req.user.ngoId;

    const volunteer = await volunteerService.createVolunteer(
      volunteerData,
      ngoId,
    );

    res.status(201).json({
      success: true,
      message: "Volunteer created successfully",
      data: volunteer,
    });
  } catch (err) {
    next(err);
  }
};

const getAllVolunteers = async (req, res, next) => {
  try {
    const ngoId = req.user.ngoId;
    const volunteers = await volunteerService.getAllVolunteers(ngoId);

    res.json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (err) {
    next(err);
  }
};

const getVolunteerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ngoId = req.user.ngoId;

    const volunteer = await volunteerService.getVolunteerById(id, ngoId);

    res.json({
      success: true,
      data: volunteer,
    });
  } catch (err) {
    next(err);
  }
};

const updateVolunteer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ngoId = req.user.ngoId;
    const updateData = req.body;

    const volunteer = await volunteerService.updateVolunteer(
      id,
      ngoId,
      updateData,
    );

    res.json({
      success: true,
      message: "Volunteer updated successfully",
      data: volunteer,
    });
  } catch (err) {
    next(err);
  }
};

// Named exports
export { createVolunteer, getAllVolunteers, getVolunteerById, updateVolunteer };
