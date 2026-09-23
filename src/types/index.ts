export type ModuleTab = 'buyer' | 'farmer' | 'logistics' | 'admin';

export type QualityGrade = 'A' | 'B' | 'C' | 'Failed';

export type PhoneType = 'SMARTPHONE' | 'KEYPAD';

export type Language = 'Gujarati' | 'Hindi' | 'English';

export type FarmerPoolStatus =
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Counter Offer'
  | 'Standby'
  | 'Replaced'
  | 'Quality Failed';

export interface LocationCoords {
  lat: number;
  lng: number;
  village: string;
  taluka: string;
  district: string;
}

export interface Farmer {
  id: string;
  name: string;
  village: string;
  phone: string;
  phoneType: PhoneType;
  preferredLanguage: Language;
  cropsGrown: string[];
  todayCrop: string;
  todayAvailableQty: number; // in kg
  offeredRate: number; // in INR/kg
  rating: number; // out of 5
  ordersCompleted: number;
  location: LocationCoords;
  isStandby: boolean;
  status: FarmerPoolStatus;
  matchScore?: number; // 0-100 calculated
  distanceKm?: number;
  counterOfferRate?: number;
}

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  gujaratiName: string;
  basePrice: number; // in INR per kg
  currentLivePrice: number; // simulated live price
  priceHistory: number[]; // mini sparkline data
  image: string;
  unit: string;
  perishability: 'High' | 'Medium' | 'Low';
  pickupWindow: string; // e.g. "4:00 AM – 5:00 AM"
  targetDeliveryTime: string; // e.g. "7:00 AM"
}

export interface DemandCropSelection {
  cropId: string;
  cropName: string;
  quantity: number;
  pricePerKg: number;
}

export interface BuyerDemand {
  id: string;
  buyerName: string;
  crops: DemandCropSelection[];
  acceptExtra10Percent: boolean;
  pickupWindow: string;
  deliveryRequiredBy: string;
  deliveryDate: string;
  postedAt: string;
  targetTotalKg: number;
}

export interface PoolContributor {
  farmerId: string;
  farmerName: string;
  village: string;
  crop: string;
  availableQty: number;
  allocatedQty: number;
  offeredRate: number;
  status: FarmerPoolStatus;
  phoneType: PhoneType;
  preferredLanguage: Language;
  rejectionReason?: string;
  isStandbyBackup?: boolean;
  actualVerifiedWeight?: number;
  verifiedGrade?: QualityGrade;
  adjustedRate?: number;
  payoutAmount?: number;
}

export interface ConsolidatedInvoice {
  orderId: string;
  buyerName: string;
  cropsSummary: string;
  contributors: PoolContributor[];
  totalKg: number;
  produceSubtotal: number;
  logisticsFee: number; // ₹1/kg paid by buyer
  handlingFee: number; // 2%
  totalPayable: number;
  escrow70PercentHold: number;
  escrow30PercentFinal: number;
  isConfirmed: boolean;
  escrowStatus: 'UNFUNDED' | '70%_HELD' | '70%_RELEASED_QC' | '100%_SETTLED';
}

export interface QualityCheckData {
  farmerId: string;
  promisedWeight: number;
  actualWeight: number;
  promisedGrade: QualityGrade;
  actualGrade: QualityGrade;
  adjustedRate: number;
  checks: {
    sizeUniform: boolean;
    noRottenProduce: boolean;
    colorAcceptable: boolean;
    ripenessAcceptable: boolean;
    packagingAcceptable: boolean;
  };
  aiImageVerified: boolean;
  aiNotes: string;
  shortfallKg: number;
  status: 'PASSED' | 'QUALITY_RISK_REPLACED';
}

export interface PickupStop {
  id: string;
  stopNumber: number;
  farmerId: string;
  farmerName: string;
  village: string;
  crop: string;
  promisedQty: number;
  distanceKm: number;
  eta: string;
  status: 'PENDING' | 'ARRIVING' | 'ARRIVED' | 'QC_IN_PROGRESS' | 'COMPLETED' | 'SKIPPED_REPLACED';
  location: LocationCoords;
  qcResult?: QualityCheckData;
}

export interface LogisticsFleet {
  fleetPartner: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  capacityKg: number;
  currentLoadKg: number;
  transportFeePerKg: number; // ₹1
  currentLocation: { lat: number; lng: number };
  activeStopIndex: number;
  pickupRunsActive: boolean;
  deliveryStatus: 'NOT_STARTED' | 'PICKUP_STARTED' | 'AT_STOP' | 'ON_THE_WAY' | 'ARRIVING_SOON' | 'ARRIVED_AT_DOORSTEP' | 'DELIVERED';
}

export interface ShortageEvent {
  originalFarmerId: string;
  originalFarmerName: string;
  village: string;
  crop: string;
  promisedQty: number;
  actualWeight: number;
  shortfallKg: number;
  standbyFarmerId: string;
  standbyFarmerName: string;
  standbyVillage: string;
  timestamp: string;
}

export interface MatchingLogEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  message: string;
  category: 'MATCH' | 'POOL' | 'FARMER' | 'STANDBY' | 'ORDER' | 'LOGISTICS' | 'QC' | 'ESCROW';
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface NotificationToast {
  id: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}
