const HOURS_IN_WEEK = 168;
const SHORT_COOLDOWN_HOURS = 48;

const normalizeNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const getPolicyWindow = (enrollmentWeeks) => {
  if (enrollmentWeeks <= 3) {
    return {
      waitingPeriodActive: true,
      maxPayoutsPerWeek: 0,
      cooldownHours: null
    };
  }

  if (enrollmentWeeks <= 8) {
    return {
      waitingPeriodActive: false,
      maxPayoutsPerWeek: 1,
      cooldownHours: HOURS_IN_WEEK
    };
  }

  if (enrollmentWeeks <= 16) {
    return {
      waitingPeriodActive: false,
      maxPayoutsPerWeek: 2,
      cooldownHours: SHORT_COOLDOWN_HOURS
    };
  }

  if (enrollmentWeeks <= 28) {
    return {
      waitingPeriodActive: false,
      maxPayoutsPerWeek: 3,
      cooldownHours: SHORT_COOLDOWN_HOURS
    };
  }

  return {
    waitingPeriodActive: false,
    maxPayoutsPerWeek: 4,
    cooldownHours: SHORT_COOLDOWN_HOURS
  };
};

const checkPayoutEligibility = (
  enrollmentWeeks,
  payoutsThisWeek,
  lastPayoutHoursAgo
) => {
  const normalizedWeeks = normalizeNumber(enrollmentWeeks);
  const normalizedPayoutsThisWeek = normalizeNumber(payoutsThisWeek);
  const normalizedLastPayoutHoursAgo = normalizeNumber(lastPayoutHoursAgo);

  const policyWindow = getPolicyWindow(normalizedWeeks);

  if (policyWindow.waitingPeriodActive) {
    return {
      eligible: false,
      reason: 'Waiting period active'
    };
  }

  if (normalizedPayoutsThisWeek >= policyWindow.maxPayoutsPerWeek) {
    return {
      eligible: false,
      reason: 'Weekly payout limit exceeded'
    };
  }

  if (normalizedLastPayoutHoursAgo < policyWindow.cooldownHours) {
    return {
      eligible: false,
      reason: 'Cooldown period not completed'
    };
  }

  return {
    eligible: true,
    reason: 'Eligible for payout'
  };
};

module.exports = {
  checkPayoutEligibility
};
