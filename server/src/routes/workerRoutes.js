const express = require('express');
const {
  getMe,
  updateMe,
  getProfileStatus
} = require('../controllers/workerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/me', getMe);
router.put('/me', updateMe);
router.get('/profile-status', getProfileStatus);

module.exports = router;
