const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createPolicy,
  getMyPolicy,
  pausePolicy,
  resumePolicy,
  updatePolicy,
  getPolicyHistory
} = require('../controllers/policyController');

const router = express.Router();

router.post('/create', protect, createPolicy);
router.get('/me', protect, getMyPolicy);
router.put('/pause', protect, pausePolicy);
router.put('/resume', protect, resumePolicy);
router.put('/update', protect, updatePolicy);
router.get('/history', protect, getPolicyHistory);

module.exports = router;
