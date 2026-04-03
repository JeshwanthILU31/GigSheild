const mongoose = require('mongoose');
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const floodRiskData = require('../data/floodRisk.json');
const { checkPayoutEligibility } = require('./policyEngine');
const { getWeatherData } = require('./weatherService');

const ACTIVE_POLICY_STATUS = 'ACTIVE';
const CLAIM_APPROVED_STATUS = 'APPROVED';
const CLAIM_REJECTED_STATUS = 'REJECTED';
const HEAVY_RAIN_THRESHOLD = 10;
const FLOOD_RISK_THRESHOLD = 0.7;
const DEFAULT_LAST_PAYOUT_HOURS = 99999;

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const normalizeText = (value) => {
  return String(value || '').trim().toLowerCase();
};

const getFloodRiskScore = (pinCode, zone) => {
  const normalizedPinCode = Number(pinCode);
  const normalizedZone = normalizeText(zone);

  for (const [range, details] of Object.entries(floodRiskData)) {
    const [start, end] = range.split('-').map(Number);
    const isPinCodeInRange =
      Number.isFinite(normalizedPinCode) &&
      normalizedPinCode >= start &&
      normalizedPinCode <= end;

    if (!isPinCodeInRange) {
      continue;
    }

    const zoneMatches =
      !normalizedZone || normalizeText(details.city).includes(normalizedZone);

    if (zoneMatches) {
      return Number(details.riskScore) || 0;
    }
  }

  return 0;
};

const getEnrollmentWeeks = (policyCreatedAt) => {
  const createdAt = new Date(policyCreatedAt);
  const diffInMs = Date.now() - createdAt.getTime();
  return Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7)));
};

const getStartOfWeek = () => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - now.getDay());
  return startOfWeek;
};

const getLastPayoutHoursAgo = (lastApprovedClaim) => {
  if (!lastApprovedClaim) {
    return DEFAULT_LAST_PAYOUT_HOURS;
  }

  const diffInMs = Date.now() - new Date(lastApprovedClaim.createdAt).getTime();
  return Math.floor(diffInMs / (1000 * 60 * 60));
};

const heavyRainTrigger = (weatherData) => {
  const rainfall = Number(weatherData?.rainfall) || 0;
  const triggered = rainfall > HEAVY_RAIN_THRESHOLD;

  return {
    triggered,
    reason: triggered
      ? `Heavy rain detected. Rainfall is ${rainfall} mm`
      : `Heavy rain not detected. Rainfall is ${rainfall} mm`
  };
};

const floodZoneTrigger = (riskScore) => {
  const normalizedRiskScore = Number(riskScore) || 0;
  const triggered = normalizedRiskScore > FLOOD_RISK_THRESHOLD;

  return {
    triggered,
    reason: triggered
      ? `Flood zone risk is high at ${normalizedRiskScore}`
      : `Flood zone risk is below threshold at ${normalizedRiskScore}`
  };
};

const platformOutageTrigger = () => {
  const isOutageActive = process.env.MOCK_PLATFORM_OUTAGE === 'true';

  return {
    triggered: isOutageActive,
    reason: isOutageActive
      ? 'Platform outage flag is active'
      : 'No platform outage detected'
  };
};

const getLatestActivePolicy = async (workerId) => {
  return Policy.findOne({
    workerId,
    status: ACTIVE_POLICY_STATUS
  }).sort({ createdAt: -1 });
};

const buildApprovedClaimPayload = (policy, triggerResult) => {
  return {
    policyId: policy._id,
    status: CLAIM_APPROVED_STATUS,
    reason: triggerResult.reason,
    disruptionType: triggerResult.disruptionType,
    estimatedPayout: policy.coverageCap,
    payoutAmount: policy.coverageCap
  };
};

const buildRejectedClaimPayload = (policy, reason) => {
  return {
    policyId: policy._id,
    status: CLAIM_REJECTED_STATUS,
    reason,
    disruptionType: 'NONE',
    estimatedPayout: 0,
    payoutAmount: 0
  };
};

const triggerClaimForWorker = async (worker) => {
  if (!worker?._id) {
    throw createError('Worker not found', 401);
  }

  const policy = await getLatestActivePolicy(worker._id);

  if (!policy) {
    throw createError('Active policy not found', 404);
  }

  const startOfWeek = getStartOfWeek();
  const approvedClaimsThisWeek = await Claim.countDocuments({
    workerId: worker._id,
    status: CLAIM_APPROVED_STATUS,
    createdAt: { $gte: startOfWeek }
  });

  const lastApprovedClaim = await Claim.findOne({
    workerId: worker._id,
    status: CLAIM_APPROVED_STATUS
  }).sort({ createdAt: -1 });

  const eligibility = checkPayoutEligibility(
    getEnrollmentWeeks(policy.createdAt),
    approvedClaimsThisWeek,
    getLastPayoutHoursAgo(lastApprovedClaim)
  );

  let claimPayload;

  if (!eligibility.eligible) {
    claimPayload = buildRejectedClaimPayload(policy, eligibility.reason);
  } else {
    const weatherData = await getWeatherData(worker.pinCode);
    const floodRiskScore = getFloodRiskScore(worker.pinCode, worker.zone);

    const triggerResults = [
      {
        disruptionType: 'HEAVY_RAIN',
        ...heavyRainTrigger(weatherData)
      },
      {
        disruptionType: 'FLOOD_ZONE',
        ...floodZoneTrigger(floodRiskScore)
      },
      {
        disruptionType: 'PLATFORM_OUTAGE',
        ...platformOutageTrigger()
      }
    ];

    const matchedTrigger = triggerResults.find((trigger) => trigger.triggered);

    if (matchedTrigger) {
      claimPayload = buildApprovedClaimPayload(policy, matchedTrigger);
    } else {
      claimPayload = buildRejectedClaimPayload(
        policy,
        'No disruption trigger matched for this claim'
      );
    }
  }

  const claim = await Claim.create({
    workerId: worker._id,
    ...claimPayload
  });

  return Claim.findById(claim._id).populate('policyId');
};

const getClaimsForWorker = async (workerId) => {
  return Claim.find({ workerId })
    .populate('policyId')
    .sort({ createdAt: -1 });
};

const getClaimForWorkerById = async (claimId, workerId) => {
  if (!mongoose.Types.ObjectId.isValid(claimId)) {
    throw createError('Claim not found', 404);
  }

  const claim = await Claim.findOne({
    _id: claimId,
    workerId
  }).populate('policyId');

  if (!claim) {
    throw createError('Claim not found', 404);
  }

  return claim;
};

module.exports = {
  heavyRainTrigger,
  floodZoneTrigger,
  platformOutageTrigger,
  triggerClaimForWorker,
  getClaimsForWorker,
  getClaimForWorkerById
};
