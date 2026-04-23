import assignmentService from "../services/assignmentService.js";


const createAssignment = async (req,res, next) => {
  try {
    const { needId, volunteerId } = req.body;
    
    const ngoId = req.user.ngoId;
    const assignedBy = req.user.id;

    
    if (!needId || !volunteerId) {
      return res.status(400).json({
        success: false,
        message: "needId and volunteerId are required",
      });
    }

    const assignment = await assignmentService.createAssignment(
      needId,
      volunteerId,
      assignedBy,
      ngoId,
    );

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    next(error);
  }
}

//getting the assignement 
const getAllAssignments = async (req, res, next) => {
  try {
    const ngoId = req.user.ngoId;
    const assignments = await assignmentService.getAllAssignments(ngoId);

    res.json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (err) {
    next(err);
  }
};

const updateAssignmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const ngoId = req.user.ngoId;

    const assignment = await assignmentService.updateAssignmentStatus(
      id,
      ngoId,
      status,
      notes,
    );

    res.json({
      success: true,
      message: "Assignment status updated",
      data: assignment,
    });
  } catch (err) {
    next(err);
  }
};

export { createAssignment, getAllAssignments, updateAssignmentStatus };