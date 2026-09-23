import { CropForecastData, RouteOptimizationData } from '../types';

export const MOCK_CROP_FORECASTS: Record<string, CropForecastData> = {
  'crop-tomato': {
    cropId: 'crop-tomato',
    cropName: 'Tomato (Tameta)',
    currentPrice: 22.4,
    predictedNextWeekPrice: 24.8,
    priceTrendPercent: 10.7,
    recommendedPurchaseWindow: 'Tomorrow 4:00 AM – 5:00 AM',
    recommendedBatchKg: 1000,
    modelConfidence: 94.8,
    weeklyTrend: [
      { day: 'Mon', date: 'Sep 21', predictedDemandKg: 850, predictedPrice: 21.5, confidencePercent: 96, supplyStatus: 'Balanced' },
      { day: 'Tue', date: 'Sep 22', predictedDemandKg: 900, predictedPrice: 22.0, confidencePercent: 95, supplyStatus: 'Balanced' },
      { day: 'Wed', date: 'Sep 23', predictedDemandKg: 950, predictedPrice: 22.4, confidencePercent: 95, supplyStatus: 'Balanced' },
      { day: 'Thu (Target)', date: 'Sep 24', predictedDemandKg: 1000, predictedPrice: 22.0, confidencePercent: 97, supplyStatus: 'Balanced' },
      { day: 'Fri', date: 'Sep 25', predictedDemandKg: 1150, predictedPrice: 23.2, confidencePercent: 94, supplyStatus: 'Shortage Risk' },
      { day: 'Sat', date: 'Sep 26', predictedDemandKg: 1300, predictedPrice: 24.5, confidencePercent: 93, supplyStatus: 'Shortage Risk' },
      { day: 'Sun', date: 'Sep 27', predictedDemandKg: 1200, predictedPrice: 24.0, confidencePercent: 94, supplyStatus: 'Balanced' }
    ],
    aiInsight:
      'Projected +24% institutional weekend surge in Surat APMC due to festival & catering bulk bookings. Pooling 1,000 kg now at ₹22.0/kg locks ₹2.80/kg savings before weekend retail surge.',
    clusterSupplySummary:
      'Strong harvest availability in Olpad cluster (Ramesh Patel • 300 kg) and Palsana cluster (Suresh Patel • 500 kg). Moderate in Kamrej (200 kg).'
  },
  'crop-potato': {
    cropId: 'crop-potato',
    cropName: 'Potato (Bataka)',
    currentPrice: 25.5,
    predictedNextWeekPrice: 25.8,
    priceTrendPercent: 1.2,
    recommendedPurchaseWindow: '5:30 AM – 6:30 AM',
    recommendedBatchKg: 1500,
    modelConfidence: 96.2,
    weeklyTrend: [
      { day: 'Mon', date: 'Sep 21', predictedDemandKg: 1200, predictedPrice: 25.0, confidencePercent: 97, supplyStatus: 'Surplus' },
      { day: 'Tue', date: 'Sep 22', predictedDemandKg: 1300, predictedPrice: 25.2, confidencePercent: 97, supplyStatus: 'Surplus' },
      { day: 'Wed', date: 'Sep 23', predictedDemandKg: 1400, predictedPrice: 25.5, confidencePercent: 96, supplyStatus: 'Balanced' },
      { day: 'Thu', date: 'Sep 24', predictedDemandKg: 1500, predictedPrice: 25.5, confidencePercent: 96, supplyStatus: 'Balanced' },
      { day: 'Fri', date: 'Sep 25', predictedDemandKg: 1600, predictedPrice: 25.8, confidencePercent: 95, supplyStatus: 'Balanced' },
      { day: 'Sat', date: 'Sep 26', predictedDemandKg: 1750, predictedPrice: 26.0, confidencePercent: 94, supplyStatus: 'Balanced' },
      { day: 'Sun', date: 'Sep 27', predictedDemandKg: 1600, predictedPrice: 25.8, confidencePercent: 95, supplyStatus: 'Balanced' }
    ],
    aiInsight:
      'Steady cold-storage dispatches from Deesa/Banaskantha. Consistent price stability expected across the week with negligible volatility.',
    clusterSupplySummary:
      'High tuber reserves available in Bardoli and Sachin cold aggregations.'
  },
  'crop-onion': {
    cropId: 'crop-onion',
    cropName: 'Onion (Dungri)',
    currentPrice: 28.2,
    predictedNextWeekPrice: 31.0,
    priceTrendPercent: 9.9,
    recommendedPurchaseWindow: '5:00 AM – 6:00 AM',
    recommendedBatchKg: 1000,
    modelConfidence: 92.5,
    weeklyTrend: [
      { day: 'Mon', date: 'Sep 21', predictedDemandKg: 900, predictedPrice: 27.5, confidencePercent: 94, supplyStatus: 'Balanced' },
      { day: 'Tue', date: 'Sep 22', predictedDemandKg: 950, predictedPrice: 28.0, confidencePercent: 93, supplyStatus: 'Balanced' },
      { day: 'Wed', date: 'Sep 23', predictedDemandKg: 1000, predictedPrice: 28.2, confidencePercent: 93, supplyStatus: 'Shortage Risk' },
      { day: 'Thu', date: 'Sep 24', predictedDemandKg: 1100, predictedPrice: 29.0, confidencePercent: 92, supplyStatus: 'Shortage Risk' },
      { day: 'Fri', date: 'Sep 25', predictedDemandKg: 1250, predictedPrice: 30.2, confidencePercent: 91, supplyStatus: 'Shortage Risk' },
      { day: 'Sat', date: 'Sep 26', predictedDemandKg: 1400, predictedPrice: 31.0, confidencePercent: 90, supplyStatus: 'Shortage Risk' },
      { day: 'Sun', date: 'Sep 27', predictedDemandKg: 1300, predictedPrice: 30.5, confidencePercent: 91, supplyStatus: 'Shortage Risk' }
    ],
    aiInsight:
      'Lasalgaon and Nashik Mandi transit arrivals slowed down by 14% due to inter-state freight congestion. Forward pooling is strongly recommended.',
    clusterSupplySummary:
      'Local Mahuva & Saurashtra stock is entering regional warehouses; Olpad and Mandvi smallholders ready.'
  },
  'crop-cabbage': {
    cropId: 'crop-cabbage',
    cropName: 'Cabbage (Kobi)',
    currentPrice: 18.5,
    predictedNextWeekPrice: 19.2,
    priceTrendPercent: 3.8,
    recommendedPurchaseWindow: '4:30 AM – 5:30 AM',
    recommendedBatchKg: 800,
    modelConfidence: 95.1,
    weeklyTrend: [
      { day: 'Mon', date: 'Sep 21', predictedDemandKg: 600, predictedPrice: 18.0, confidencePercent: 96, supplyStatus: 'Balanced' },
      { day: 'Tue', date: 'Sep 22', predictedDemandKg: 650, predictedPrice: 18.2, confidencePercent: 95, supplyStatus: 'Balanced' },
      { day: 'Wed', date: 'Sep 23', predictedDemandKg: 700, predictedPrice: 18.5, confidencePercent: 95, supplyStatus: 'Balanced' },
      { day: 'Thu', date: 'Sep 24', predictedDemandKg: 800, predictedPrice: 18.5, confidencePercent: 96, supplyStatus: 'Balanced' },
      { day: 'Fri', date: 'Sep 25', predictedDemandKg: 850, predictedPrice: 18.8, confidencePercent: 94, supplyStatus: 'Balanced' },
      { day: 'Sat', date: 'Sep 26', predictedDemandKg: 950, predictedPrice: 19.2, confidencePercent: 93, supplyStatus: 'Balanced' },
      { day: 'Sun', date: 'Sep 27', predictedDemandKg: 900, predictedPrice: 19.0, confidencePercent: 94, supplyStatus: 'Balanced' }
    ],
    aiInsight:
      'Stable winter green arrivals across South Gujarat. Recommended batch size of 800 kg aligns with Maroli smallholder clusters.',
    clusterSupplySummary:
      'Pravin Parmar (Maroli) and surrounding Navsari farmers have high availability.'
  },
  'crop-cauliflower': {
    cropId: 'crop-cauliflower',
    cropName: 'Cauliflower (Fulaver)',
    currentPrice: 23.8,
    predictedNextWeekPrice: 25.0,
    priceTrendPercent: 5.0,
    recommendedPurchaseWindow: '4:15 AM – 5:15 AM',
    recommendedBatchKg: 600,
    modelConfidence: 93.7,
    weeklyTrend: [
      { day: 'Mon', date: 'Sep 21', predictedDemandKg: 450, predictedPrice: 23.5, confidencePercent: 95, supplyStatus: 'Balanced' },
      { day: 'Tue', date: 'Sep 22', predictedDemandKg: 500, predictedPrice: 23.8, confidencePercent: 94, supplyStatus: 'Balanced' },
      { day: 'Wed', date: 'Sep 23', predictedDemandKg: 550, predictedPrice: 23.8, confidencePercent: 94, supplyStatus: 'Balanced' },
      { day: 'Thu', date: 'Sep 24', predictedDemandKg: 600, predictedPrice: 24.0, confidencePercent: 95, supplyStatus: 'Balanced' },
      { day: 'Fri', date: 'Sep 25', predictedDemandKg: 650, predictedPrice: 24.5, confidencePercent: 93, supplyStatus: 'Shortage Risk' },
      { day: 'Sat', date: 'Sep 26', predictedDemandKg: 750, predictedPrice: 25.0, confidencePercent: 92, supplyStatus: 'Shortage Risk' },
      { day: 'Sun', date: 'Sep 27', predictedDemandKg: 700, predictedPrice: 24.8, confidencePercent: 93, supplyStatus: 'Balanced' }
    ],
    aiInsight:
      'Perishable curd firmness requires early morning cold-transit. Pre-dawn pickup window guarantees zero curd discoloration.',
    clusterSupplySummary:
      'Bhavna Patel (Kamrej) and Sachin smallholder clusters ready for collection.'
  }
};

export const MOCK_ROUTE_OPTIMIZATION: RouteOptimizationData = {
  unoptimizedDistanceKm: 102.4,
  unoptimizedDurationMinutes: 195, // 3h 15m
  unoptimizedCarbonKg: 28.6,
  unoptimizedPerishRisk: 'High (14.2% Thermal Dehydration Risk)',
  optimizedDistanceKm: 64.2,
  optimizedDurationMinutes: 95, // 1h 35m
  optimizedCarbonKg: 16.2,
  optimizedPerishRisk: '0% (Cold-Chain Reefer Intact)',
  distanceSavedPercent: 37.3,
  timeSavedPercent: 51.3,
  carbonSavedPercent: 43.4,
  algorithmName: 'Clarke-Wright Savings Heuristic + Perishable Decay Time-Window CVRP'
};
