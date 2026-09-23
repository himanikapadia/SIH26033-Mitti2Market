import { Farmer, Crop, QualityGrade } from '../types';

/**
 * Calculates a 0-100 Matching Score based on:
 * Crop match (40) + Quantity fit (25) + Distance (15) + Quality rating (10) + Timing (10)
 */
export function calculateFarmerMatchScore(
  farmer: Farmer,
  targetCropName: string,
  targetQty: number
): number {
  // 1. Crop Match (0 to 40)
  const isDirectCrop = farmer.todayCrop.toLowerCase() === targetCropName.toLowerCase();
  const growsCrop = farmer.cropsGrown.some(
    (c) => c.toLowerCase() === targetCropName.toLowerCase()
  );
  const cropMatchScore = isDirectCrop ? 40 : growsCrop ? 25 : 0;
  if (cropMatchScore === 0) return 0;

  // 2. Quantity Fit (0 to 25)
  // Optimal fit is where farmer's available quantity contributes meaningfully (at least 15% and up to 100%)
  const ratio = Math.min(1, farmer.todayAvailableQty / targetQty);
  const quantityFit = Math.round(ratio * 25);

  // 3. Distance Score (0 to 15)
  // Within 15km = 15, up to 50km decays
  const dist = farmer.distanceKm || 20;
  const distanceScore = Math.max(0, Math.round(15 - (dist / 50) * 10));

  // 4. Quality Rating (0 to 10)
  // Rating 4.0 - 5.0 -> 0 to 10
  const qualityScore = Math.round(((farmer.rating - 3.5) / 1.5) * 10);

  // 5. Time Availability (0 to 10)
  // Non-standby active farmers get full 10, standby get 8
  const timeScore = farmer.isStandby ? 8 : 10;

  const total = cropMatchScore + quantityFit + distanceScore + qualityScore + timeScore;
  return Math.min(99, Math.max(10, total));
}

/**
 * Finds optimal combination of smallholder farmers to fulfill bulk demand
 */
export function findPoolingCombination(
  farmers: Farmer[],
  targetCropName: string,
  targetQuantity: number,
  excludeFarmerIds: string[] = []
): { matchedFarmers: Farmer[]; totalPooled: number; shortage: number } {
  // Filter eligible non-standby farmers with matching crop
  const eligible = farmers
    .filter(
      (f) =>
        !excludeFarmerIds.includes(f.id) &&
        !f.isStandby &&
        f.todayCrop.toLowerCase() === targetCropName.toLowerCase()
    )
    .sort((a, b) => {
      const scoreA = calculateFarmerMatchScore(a, targetCropName, targetQuantity);
      const scoreB = calculateFarmerMatchScore(b, targetCropName, targetQuantity);
      return scoreB - scoreA;
    });

  const selected: Farmer[] = [];
  let accumulated = 0;

  for (const farmer of eligible) {
    if (accumulated >= targetQuantity) break;
    selected.push(farmer);
    accumulated += farmer.todayAvailableQty;
  }

  const shortage = Math.max(0, targetQuantity - accumulated);
  return {
    matchedFarmers: selected,
    totalPooled: accumulated,
    shortage
  };
}

/**
 * Finds the best standby replacement farmer for a shortfall or rejection
 */
export function findStandbyReplacement(
  farmers: Farmer[],
  targetCropName: string,
  neededQuantity: number,
  currentAssignedIds: string[]
): Farmer | null {
  // Search standby farmers first, then unassigned regular farmers
  const standbys = farmers
    .filter(
      (f) =>
        !currentAssignedIds.includes(f.id) &&
        f.status !== 'Rejected' &&
        f.status !== 'Quality Failed' &&
        f.todayCrop.toLowerCase() === targetCropName.toLowerCase()
    )
    .sort((a, b) => {
      // Prioritize standby marked farmers
      if (a.isStandby && !b.isStandby) return -1;
      if (!a.isStandby && b.isStandby) return 1;
      // Then closest quantity fit
      const diffA = Math.abs(a.todayAvailableQty - neededQuantity);
      const diffB = Math.abs(b.todayAvailableQty - neededQuantity);
      return diffA - diffB;
    });

  return standbys.length > 0 ? standbys[0] : null;
}

/**
 * Price adjustment based on verified farm gate quality
 */
export function adjustRateByQuality(baseRate: number, grade: QualityGrade): number {
  switch (grade) {
    case 'A':
      return baseRate; // 100%
    case 'B':
      return Math.round(baseRate * 0.909 * 10) / 10; // ~₹20/kg for ₹22 base (approx 91%)
    case 'C':
      return Math.round(baseRate * 0.818 * 10) / 10; // ~₹18/kg (approx 82%)
    case 'Failed':
      return 0;
    default:
      return baseRate;
  }
}
