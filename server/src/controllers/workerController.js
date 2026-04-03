const {
  getWorkerProfile,
  updateWorkerProfile,
  getWorkerProfileStatus
} = require('../services/workerService');

const getMe = async (req, res) => {
  try {
    const worker = await getWorkerProfile(req.worker.id);

    return res.status(200).json({
      success: true,
      message: 'Worker profile fetched successfully',
      data: worker
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch worker profile'
    });
  }
};

const updateMe = async (req, res) => {
  try {
    const worker = await updateWorkerProfile(req.worker.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Worker profile updated successfully',
      data: worker
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to update worker profile'
    });
  }
};

const getProfileStatus = async (req, res) => {
  try {
    const profileStatus = await getWorkerProfileStatus(req.worker.id);

    return res.status(200).json({
      success: true,
      message: 'Worker profile status fetched successfully',
      data: profileStatus
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch profile status'
    });
  }
};

module.exports = {
  getMe,
  updateMe,
  getProfileStatus
};
