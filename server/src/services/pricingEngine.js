const AVG_PAYOUT = 350;
const BASE_FEE = 50;
const MARGIN = 0.2;
const HEAVY_RAIN_SURCHARGE = 30;
const PREMIUM_FLOOR = 39;
const PREMIUM_CAP = 199;

const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const normalizeNumber = (value) => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const roundToTwoDecimals = (value) => {
  return Number(value.toFixed(2));
};

const getTierDetails = (premium) => {
  if (premium <= 69) {
    return {
      tier: 'basic',
      coverageCap: 800
    };
  }

  if (premium <= 119) {
    return {
      tier: 'standard',
      coverageCap: 1500
    };
  }

  return {
    tier: 'premium',
    coverageCap: 2000
  };
};

const calculatePremium = (zone, weatherData, floodRisk) => {
  const rainfall = normalizeNumber(weatherData?.rainfall);
  const temperature = normalizeNumber(weatherData?.temperature);
  const aqi = normalizeNumber(weatherData?.aqi);
  const normalizedFloodRisk = clamp(normalizeNumber(floodRisk), 0, 1);

  const rainfallFactor = Math.min(rainfall / 50, 1);
  const tempFactor = temperature > 44 ? 1 : 0;
  const aqiFactor = aqi > 300 ? 1 : 0;

  const riskScore =
    (0.5 * normalizedFloodRisk) +
    (0.3 * rainfallFactor) +
    (0.1 * tempFactor) +
    (0.1 * aqiFactor);

  const probability = clamp(riskScore, 0, 1);
  const expectedLoss = probability * AVG_PAYOUT;

  let premium = expectedLoss * (1 + MARGIN) + BASE_FEE;

  if (rainfall > 40) {
    premium += HEAVY_RAIN_SURCHARGE;
  }

  premium = clamp(premium, PREMIUM_FLOOR, PREMIUM_CAP);

  const { tier, coverageCap } = getTierDetails(premium);

  return {
    riskScore: roundToTwoDecimals(riskScore),
    probability: roundToTwoDecimals(probability),
    expectedLoss: roundToTwoDecimals(expectedLoss),
    premium: Math.round(premium),
    tier,
    coverageCap
  };
};

module.exports = {
  calculatePremium
};
