const {
  triggerClaimForWorker,
  getClaimsForWorker,
  getClaimForWorkerById
} = require('../services/claimService');

const triggerClaim = async (req, res) => {
  try {
    const claim = await triggerClaimForWorker(req.worker);

    return res.status(201).json({
      success: true,
      message: 'Claim processed successfully',
      data: claim
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to trigger claim'
    });
  }
};

const getMyClaims = async (req, res) => {
  try {
    const claims = await getClaimsForWorker(req.worker._id);

    return res.status(200).json({
      success: true,
      message: 'Claims fetched successfully',
      data: claims
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch claims'
    });
  }
};

const getClaimById = async (req, res) => {
  try {
    const claim = await getClaimForWorkerById(req.params.id, req.worker._id);

    return res.status(200).json({
      success: true,
      message: 'Claim fetched successfully',
      data: claim
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to fetch claim'
    });
  }
};

module.exports = {
  triggerClaim,
  getMyClaims,
  getClaimById
};
