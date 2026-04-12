const Scan = require("../models/Scan");
const User = require("../models/User");

const DEFAULT_PROFILE = {
  score: 70,
  status: "BALANCED",
  insight: "Start scanning products to build your health profile.",
  averageProductScore: 0,
  healthyScanCount: 0,
  harmfulScanCount: 0,
  totalScans: 0,
  trend: 0,
  lastUpdated: new Date(),
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getAnalysis(result = {}) {
  return result.analysis || result || {};
}

function getProduct(result = {}) {
  return result.product || {};
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getStatus(score) {
  if (score >= 80) return "OPTIMAL";
  if (score >= 65) return "BALANCED";
  if (score >= 45) return "CAUTION";
  return "AT RISK";
}

function getRecommendationAdjustment(recommendation = "") {
  const normalized = String(recommendation).toLowerCase();
  if (normalized.includes("avoid")) return -8;
  if (normalized.includes("limit")) return -5;
  if (normalized.includes("caution")) return -3;
  if (normalized.includes("moderate")) return -2;
  if (normalized.includes("good")) return 4;
  if (normalized.includes("safe")) return 6;
  return 0;
}

function getRecencyWeight(createdAt) {
  const ageInDays = Math.max(
    0,
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24),
  );

  if (ageInDays <= 3) return 1.3;
  if (ageInDays <= 7) return 1.15;
  if (ageInDays <= 14) return 1;
  return 0.85;
}

function calculateScanImpact(scan) {
  const analysis = getAnalysis(scan.result);
  const score = clamp(toNumber(analysis.score, 50), 0, 100);
  const safeIngredients = Array.isArray(analysis.safeIngredients)
    ? analysis.safeIngredients.length
    : 0;
  const avoidIngredients = Array.isArray(analysis.avoidIngredients)
    ? analysis.avoidIngredients.length
    : 0;
  const ingredientBalance = safeIngredients * 1.8 - avoidIngredients * 2.6;
  const scoreBalance = (score - 60) * 0.42;
  const recommendationAdjustment = getRecommendationAdjustment(
    analysis.recommendation,
  );

  return clamp(scoreBalance + ingredientBalance + recommendationAdjustment, -20, 20);
}

function buildInsight({
  score,
  trend,
  healthyScanCount,
  harmfulScanCount,
  totalScans,
  averageProductScore,
}) {
  if (!totalScans) {
    return DEFAULT_PROFILE.insight;
  }

  if (harmfulScanCount >= healthyScanCount + 2) {
    return `Recent scans show more harmful products than healthy ones. Try swapping a few low-scoring items to recover your score.`;
  }

  if (trend >= 6) {
    return `Your recent food choices are improving. Product quality is up ${Math.round(
      trend,
    )} points versus the previous week.`;
  }

  if (trend <= -6) {
    return `Your recent scans dipped ${Math.abs(
      Math.round(trend),
    )} points from the previous week. Cutting back on low-quality products will help quickly.`;
  }

  if (averageProductScore >= 80) {
    return "You are consistently scanning strong products. Keep this pattern going to maintain an optimal score.";
  }

  return "Your score is steady. A few higher-quality swaps can push your health status higher this week.";
}

function summariseScans(scans = []) {
  if (!scans.length) {
    return {
      profile: { ...DEFAULT_PROFILE },
      recentScans: [],
    };
  }

  let weightedImpact = 0;
  let totalWeight = 0;
  let totalScore = 0;
  let healthyScanCount = 0;
  let harmfulScanCount = 0;

  const now = Date.now();
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  let recentWeekScore = 0;
  let recentWeekCount = 0;
  let previousWeekScore = 0;
  let previousWeekCount = 0;

  const recentScans = scans.slice(0, 5).map((scan) => {
    const analysis = getAnalysis(scan.result);
    const product = getProduct(scan.result);
    const scanScore = clamp(toNumber(analysis.score, 0), 0, 100);
    const recommendation = analysis.recommendation || "UNKNOWN";

    return {
      id: String(scan._id),
      title: product.name || scan.barcode || "Scanned Product",
      subtitle: product.subtitle || scan.type.toUpperCase(),
      image: product.image || scan.image || "",
      score: scanScore,
      status: recommendation.toUpperCase(),
      createdAt: scan.createdAt,
    };
  });

  scans.forEach((scan) => {
    const analysis = getAnalysis(scan.result);
    const scanScore = clamp(toNumber(analysis.score, 50), 0, 100);
    const weight = getRecencyWeight(scan.createdAt);
    const impact = calculateScanImpact(scan);
    const createdAt = new Date(scan.createdAt).getTime();

    weightedImpact += impact * weight;
    totalWeight += weight;
    totalScore += scanScore;

    if (scanScore >= 75) healthyScanCount += 1;
    if (scanScore < 50) harmfulScanCount += 1;

    if (createdAt >= oneWeekAgo) {
      recentWeekScore += scanScore;
      recentWeekCount += 1;
    } else if (createdAt >= twoWeeksAgo) {
      previousWeekScore += scanScore;
      previousWeekCount += 1;
    }
  });

  const averageProductScore = Math.round(totalScore / scans.length);
  const score = Math.round(
    clamp(65 + (totalWeight ? weightedImpact / totalWeight : 0), 0, 100),
  );
  const recentAverage = recentWeekCount ? recentWeekScore / recentWeekCount : averageProductScore;
  const previousAverage = previousWeekCount
    ? previousWeekScore / previousWeekCount
    : recentAverage;
  const trend = Math.round(recentAverage - previousAverage);

  const profile = {
    score,
    status: getStatus(score),
    insight: buildInsight({
      score,
      trend,
      healthyScanCount,
      harmfulScanCount,
      totalScans: scans.length,
      averageProductScore,
    }),
    averageProductScore,
    healthyScanCount,
    harmfulScanCount,
    totalScans: scans.length,
    trend,
    lastUpdated: new Date(),
  };

  return {
    profile,
    recentScans,
  };
}

async function refreshUserHealthProfile(userId) {
  const scans = await Scan.find({ user: userId }).sort({ createdAt: -1 }).limit(30).lean();
  const { profile, recentScans } = summariseScans(scans);

  await User.findByIdAndUpdate(userId, { healthProfile: profile });

  return {
    healthProfile: profile,
    recentScans,
  };
}

module.exports = {
  DEFAULT_PROFILE,
  summariseScans,
  refreshUserHealthProfile,
};
