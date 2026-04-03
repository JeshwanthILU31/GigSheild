const Worker = require('../models/Worker');

const PIN_CODE_REGEX = /^\d{6}$/;
const UPI_REGEX = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
const ACTIVE_HOURS_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const getWorkerProfile = async (workerId) => {
  const worker = await Worker.findById(workerId).select('-password');

  if (!worker) {
    const error = new Error('Worker not found');
    error.statusCode = 404;
    throw error;
  }

  return worker;
};

const updateWorkerProfile = async (workerId, payload) => {
  const allowedFields = ['zone', 'pinCode', 'upiId', 'activeHours'];
  const requestFields = Object.keys(payload || {});

  if (requestFields.length === 0) {
    const error = new Error('No fields provided for update');
    error.statusCode = 400;
    throw error;
  }

  const disallowedFields = requestFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (disallowedFields.length > 0) {
    const error = new Error(
      `Disallowed fields in update: ${disallowedFields.join(', ')}`
    );
    error.statusCode = 400;
    throw error;
  }

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(payload, 'zone')) {
    if (
      typeof payload.zone !== 'string' ||
      !payload.zone.trim() ||
      payload.zone.trim().length > 80
    ) {
      const error = new Error('zone must be a valid non-empty string up to 80 characters');
      error.statusCode = 400;
      throw error;
    }

    updates.zone = payload.zone.trim();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'pinCode')) {
    if (typeof payload.pinCode !== 'string' || !PIN_CODE_REGEX.test(payload.pinCode)) {
      const error = new Error('pinCode must be a valid 6-digit string');
      error.statusCode = 400;
      throw error;
    }

    updates.pinCode = payload.pinCode;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'upiId')) {
    if (typeof payload.upiId !== 'string' || !UPI_REGEX.test(payload.upiId)) {
      const error = new Error('upiId must be a valid UPI ID');
      error.statusCode = 400;
      throw error;
    }

    updates.upiId = payload.upiId.trim().toLowerCase();
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'activeHours')) {
    const activeHours = payload.activeHours;

    if (
      !activeHours ||
      typeof activeHours !== 'object' ||
      typeof activeHours.start !== 'string' ||
      typeof activeHours.end !== 'string' ||
      !ACTIVE_HOURS_REGEX.test(activeHours.start) ||
      !ACTIVE_HOURS_REGEX.test(activeHours.end)
    ) {
      const error = new Error('activeHours must include valid start and end in HH:MM format');
      error.statusCode = 400;
      throw error;
    }

    updates.activeHours = {
      start: activeHours.start,
      end: activeHours.end
    };
  }

  const updatedWorker = await Worker.findByIdAndUpdate(
    workerId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password');

  if (!updatedWorker) {
    const error = new Error('Worker not found');
    error.statusCode = 404;
    throw error;
  }

  return updatedWorker;
};

const getWorkerProfileStatus = async (workerId) => {
  const worker = await Worker.findById(workerId).select(
    'zone pinCode upiId activeHours.start activeHours.end'
  );

  if (!worker) {
    const error = new Error('Worker not found');
    error.statusCode = 404;
    throw error;
  }

  const missingFields = [];

  if (!worker.zone) missingFields.push('zone');
  if (!worker.pinCode) missingFields.push('pinCode');
  if (!worker.upiId) missingFields.push('upiId');
  if (!worker.activeHours?.start) missingFields.push('activeHours.start');
  if (!worker.activeHours?.end) missingFields.push('activeHours.end');

  return {
    isProfileComplete: missingFields.length === 0,
    missingFields
  };
};

module.exports = {
  getWorkerProfile,
  updateWorkerProfile,
  getWorkerProfileStatus
};
