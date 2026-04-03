const Policy = require('../models/Policy');
const Worker = require('../models/Worker');
const floodRiskData = require('../data/floodRisk.json');
const { getWeatherData } = require('../services/weatherService');
const { calculatePremium } = require('../services/pricingEngine');

const ACTIVE_POLICY_STATUS = 'ACTIVE';
const PAUSED_POLICY_STATUS = 'PAUSED';
const DEFAULT_RENEWAL_DAYS = 7;

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
      Number.isFinite(start) &&
      Number.isFinite(end) &&
      normalizedPinCode >= start &&
      normalizedPinCode <= end;

    if (!isPinCodeInRange) {
      continue;
    }

    const cityMatchesZone =
      !normalizedZone || normalizeText(details.city).includes(normalizedZone);

    if (cityMatchesZone) {
      return Number(details.riskScore) || 0;
    }
  }

  return 0;
};

const createPolicy = async (req, res) => {
  try {
    const worker = await Worker.findById(req.worker._id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    const existingPolicy = await Policy.findOne({
      workerId: worker._id,
      status: { $in: [ACTIVE_POLICY_STATUS, PAUSED_POLICY_STATUS] }
    });

    if (existingPolicy) {
      return res.status(409).json({
        success: false,
        message: 'Policy already exists for this worker'
      });
    }

    const weatherData = await getWeatherData(worker.pinCode);
    const floodRisk = getFloodRiskScore(worker.pinCode, worker.zone);
    const pricing = calculatePremium(worker.zone, weatherData, floodRisk);

    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + DEFAULT_RENEWAL_DAYS);

    const policy = await Policy.create({
      workerId: worker._id,
      weeklyPremium: pricing.premium,
      premiumTier: pricing.tier.toUpperCase(),
      coverageCap: pricing.coverageCap,
      riskScore: pricing.riskScore,
      status: ACTIVE_POLICY_STATUS,
      renewalDate
    });

    const createdPolicy = await Policy.findById(policy._id).populate('workerId');
    const policyData = createdPolicy.toObject();
    policyData.riskScore = pricing.riskScore;

    return res.status(201).json({
      success: true,
      data: policyData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create policy'
    });
  }
};

const getMyPolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      workerId: req.worker._id,
      status: ACTIVE_POLICY_STATUS
    }).populate('workerId');

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Active policy not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: policy
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch active policy'
    });
  }
};

const pausePolicy = async (req, res) => {
  try {
    const policy = await Policy.findOne({
      workerId: req.worker._id,
      status: ACTIVE_POLICY_STATUS
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Active policy not found'
      });
    }

    const updatedPolicy = await Policy.findByIdAndUpdate(
      policy._id,
      { status: PAUSED_POLICY_STATUS },
      { new: true }
    ).populate('workerId');

    return res.status(200).json({
      success: true,
      data: updatedPolicy
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to pause policy'
    });
  }
};

const getPolicyHistory = async (req, res) => {
  try {
    const policies = await Policy.find({
      workerId: req.worker._id
    })
      .populate('workerId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: policies
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch policy history'
    });
  }
};

module.exports = {
  createPolicy,
  getMyPolicy,
  pausePolicy,
  getPolicyHistory
};