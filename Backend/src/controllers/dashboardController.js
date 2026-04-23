import needRepository from '../repositories/needRepository.js';
import assignmentRepository from '../repositories/assignmentRepository.js';
import volunteerRepository from '../repositories/volunteerRepository.js';

const getOverview = async (req, res, next) => {
  try {
    const ngoId = req.user.ngoId;

    const [needs, assignments, volunteers] = await Promise.all([
      needRepository.findByNgoId(ngoId),
      assignmentRepository.findByNgoId(ngoId),
      volunteerRepository.findByNgoId(ngoId)
    ]);

    const criticalNeeds = needs.filter(n => n.priority === 'critical').length;
    const activeAssignments = assignments.filter(a => 
      ['pending', 'assigned', 'in_progress'].includes(a.status)
    ).length;
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;

    const completionRate = assignments.length > 0 
      ? Math.round((completedAssignments / assignments.length) * 100) 
      : 0;

    res.json({
      success: true,
      data: {
        totalNeeds: needs.length,
        totalAssignments: assignments.length,
        totalVolunteers: volunteers.length,
        criticalNeeds,
        activeAssignments,
        completedAssignments,
        completionRate,
        availableVolunteers: volunteers.filter(v => v.availability === 'available').length
      }
    });
  } catch (err) {
    next(err);
  }
};

const getCriticalNeeds = async (req, res, next) => {
  try {
    const ngoId = req.user.ngoId;
    const needs = await needRepository.findByNgoId(ngoId);
    const criticalNeeds = needs.filter(n => n.priority === 'critical');

    res.json({
      success: true,
      count: criticalNeeds.length,
      data: criticalNeeds
    });
  } catch (err) {
    next(err);
  }
};

const getActiveAssignments = async (req, res, next) => {
  try {
    const ngoId = req.user.ngoId;
    const assignments = await assignmentRepository.findByNgoId(ngoId);
    const active = assignments.filter(a => 
      ['pending', 'assigned', 'in_progress'].includes(a.status)
    );

    res.json({
      success: true,
      count: active.length,
      data: active
    });
  } catch (err) {
    next(err);
  }
};

const getVolunteerStats = async (req, res, next) => {
  try {
    const ngoId = req.user.ngoId;
    const volunteers = await volunteerRepository.findByNgoId(ngoId);

    const stats = {
      total: volunteers.length,
      available: volunteers.filter(v => v.availability === 'available').length,
      busy: volunteers.filter(v => v.availability === 'busy').length,
      onAssignment: volunteers.filter(v => v.availability === 'on_assignment').length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    next(err);
  }
};

export { 
  getOverview, 
  getCriticalNeeds, 
  getActiveAssignments, 
  getVolunteerStats 
};