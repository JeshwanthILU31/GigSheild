const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  triggerClaim,
  getMyClaims,
  getClaimById
} = require('../controllers/claimController');

const router = express.Router();

router.post('/trigger', protect, triggerClaim);
router.get('/me', protect, getMyClaims);
router.get('/:id', protect, getClaimById);

module.exports = router;
