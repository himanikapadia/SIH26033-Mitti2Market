export interface AIModelSpec {
  id: string;
  name: string;
  tagline: string;
  architecture: string;
  accuracy: string;
  latency: string;
  offlineReady: boolean;
  trainingDataset: string;
  description: string;
  mathematicalFormula: string;
  sampleInput: Record<string, any>;
  sampleOutput: Record<string, any>;
}

export const AI_MODELS: AIModelSpec[] = [
  {
    id: 'mitti-forecaster',
    name: 'MittiForecaster v3.1',
    tagline: 'Multi-Horizon APMC Demand & Spot Price Arbitrage Regressor',
    architecture: 'Bidirectional LSTM + LightGBM Gradient-Boosted Decision Trees',
    accuracy: '94.8% R² Score',
    latency: '14.2 ms',
    offlineReady: true,
    trainingDataset: '5 Years of Gujarat APMC Mandi Daily Arrivals (Agmarknet, 2019-2024) + IMD Meteorological Trends',
    description: 'Predicts 7-day institutional demand curves, anticipates cluster supply shortages before harvest, and spots wholesale arbitrage margins between APMC spot prices and farm-gate contracts.',
    mathematicalFormula: 'y_{t+h} = f_{\\text{LSTM}}(X_{t-k:t}; \\theta) + g_{\\text{LGBM}}(Z_t) + \\epsilon',
    sampleInput: {
      crop_id: 'crop-tomato',
      district: 'Surat, Gujarat',
      lookback_days: 14,
      target_horizon: '7_days',
      weather_index: { avg_temp_c: 32.4, humidity_pct: 68 }
    },
    sampleOutput: {
      projected_weekly_demand_kg: 1050,
      predicted_spot_price_inr: 22.0,
      confidence_interval_95: [20.5, 23.8],
      cluster_deficit_risk: 'LOW (12.4% probability)'
    }
  },
  {
    id: 'mitti-match',
    name: 'MittiMatch Bi-Graph v2.4',
    tagline: 'Bipartite Matching & Multi-Dimensional Knapsack Aggregator',
    architecture: 'Kuhn-Munkres (Hungarian Algorithm) + Geo-Spatial DBSCAN Clustering',
    accuracy: '98.2% Allocation Efficiency',
    latency: '31.8 ms (150 Farmers)',
    offlineReady: true,
    trainingDataset: 'Historical Farmer Crop Yields, Fulfillment Reliability & Distance Matrices',
    description: 'Solves Pareto-optimal smallholder aggregation under minimum batch sizes, geographic collection clusters, and ±10% buyer tolerances without leaving smallholders stranded.',
    mathematicalFormula: '\\max \\sum_{i \\in \\mathcal{F}} \\text{Score}(f_i, D) \\cdot x_i \\quad \\text{s.t.} \\quad Q \\le \\sum_{i} q_i x_i \\le Q(1 + \\tau)',
    sampleInput: {
      buyer_demand_kg: 1000,
      crop: 'Tomato',
      candidate_farmers_scanned: 15,
      max_cluster_radius_km: 15.0
    },
    sampleOutput: {
      matched_farmers: ['Ramesh Patel (300kg)', 'Mahesh Patel (200kg)', 'Suresh Patel (500kg)'],
      total_pooled_kg: 1000,
      cluster_centroid: [21.1702, 72.8311],
      pareto_optimality_score: 0.961
    }
  },
  {
    id: 'mitti-route',
    name: 'MittiRoute CVRP-TW v4.0',
    tagline: 'Perishable Cold-Chain Capacitated Vehicle Routing Engine',
    architecture: 'Clarke-Wright Savings Heuristic + Perishable Arrhenius Thermal Decay Penalty',
    accuracy: '-37.3% km Savings / 0% Spoilage',
    latency: '18.5 ms',
    offlineReady: true,
    trainingDataset: 'Gujarat Rural Road Network (OpenStreetMap GeoJSON) + Thermal Spoilage Half-Life Kinetics',
    description: 'Computes optimal multi-stop farm gate collection route with real-time waypoint dynamic rerouting upon shortfall detection, respecting truck payload capacity and cold-chain temperature thresholds.',
    mathematicalFormula: 's(i,j) = d(D,i) + d(D,j) - d(i,j) - \\lambda \\cdot \\int_{t_i}^{t_j} k(T) \\, dt',
    sampleInput: {
      depot: 'Surat APMC Hub',
      vehicle_capacity_kg: 2500,
      stops: ['Olpad (300kg)', 'Kamrej (200kg)', 'Palsana (500kg)', 'Bardoli (Backup 500kg)'],
      temp_target_c: 12.0
    },
    sampleOutput: {
      optimized_sequence: ['Hub', 'Olpad', 'Kamrej', 'Palsana', 'Hub'],
      total_distance_km: 64.2,
      transit_duration_mins: 95,
      carbon_co2_kg: 16.2,
      spoilage_risk_percent: 0.0
    }
  },
  {
    id: 'mitti-vision',
    name: 'MittiVision Edge v1.8',
    tagline: 'Farm-Gate Produce Defect Segmentation & Brix Ripeness Regressor',
    architecture: 'YOLOv8-Nano (INT8 Quantized) + MobileNetV3 Colorimetry Feature Extractor',
    accuracy: '98.6% Agmark Concordance',
    latency: '24.0 ms (On-Device Mobile CPU)',
    offlineReady: true,
    trainingDataset: '45,000 Annotated Images of Indian Tomato, Potato & Onion Cultivars across Grades A/B/C/Failed',
    description: 'Runs on low-cost rural Android devices or Raspberry Pi without cloud connectivity. Automatically grades produce, inspects surface blemishes, estimates sugar Brix levels, and stamps digital Agmark seals.',
    mathematicalFormula: '\\mathcal{L}_{\\text{total}} = \\lambda_1 \\mathcal{L}_{\\text{box}} + \\lambda_2 \\mathcal{L}_{\\text{cls}} + \\lambda_3 \\mathcal{L}_{\\text{dfl}}',
    sampleInput: {
      image_source: 'Camera Viewfinder / Sensor',
      crop_type: 'Tomato (Solanum lycopersicum)',
      inference_hardware: 'Snapdragon 680 (Mobile CPU Edge)'
    },
    sampleOutput: {
      detected_produce_count: 3,
      predicted_grade: 'Grade A (Agmark Export Standard)',
      blemish_area_ratio: 0.003,
      estimated_brix_degrees: 4.8,
      digital_cert_hash: '0x8f2d4e7b1a9c'
    }
  }
];

export interface FarmerExplainabilityScore {
  farmerId: string;
  farmerName: string;
  village: string;
  overallScore: number;
  factors: {
    label: string;
    weight: number;
    score: number;
    maxScore: number;
    rationale: string;
  }[];
  algorithmDecision: string;
}

export const FARMER_EXPLAINABILITY_DATA: Record<string, FarmerExplainabilityScore> = {
  'farmer-ramesh': {
    farmerId: 'farmer-ramesh',
    farmerName: 'Ramesh Patel',
    village: 'Olpad (8.4 km)',
    overallScore: 96.2,
    factors: [
      { label: 'Geographic Proximity', weight: 30, score: 28.5, maxScore: 30, rationale: 'Located on primary SH-168 highway corridor; minimal 1.2 km detour.' },
      { label: 'Historical Agmark Reliability', weight: 25, score: 24.5, maxScore: 25, rationale: '98.2% Grade-A delivery track record across 14 previous pooled batches.' },
      { label: 'Batch Quota Fit', weight: 20, score: 19.5, maxScore: 20, rationale: '300 kg lot perfectly fills 30% of the 1,000 kg requisition without fragmentation.' },
      { label: 'Cold-Chain Freshness Buffer', weight: 15, score: 14.5, maxScore: 15, rationale: 'Morning harvest at 04:00 AM allows 14-hour ambient shelf-life margin.' },
      { label: 'Marginal Transport Cost', weight: 10, score: 9.2, maxScore: 10, rationale: 'Route addition incurs only ₹110 incremental fuel expenditure.' }
    ],
    algorithmDecision: 'Tier-1 Priority Primary Match (Hungarian Bi-Graph rank #1 in Olpad sub-cluster).'
  },
  'farmer-mahesh': {
    farmerId: 'farmer-mahesh',
    farmerName: 'Mahesh Patel',
    village: 'Kamrej (14.2 km)',
    overallScore: 92.4,
    factors: [
      { label: 'Geographic Proximity', weight: 30, score: 26.8, maxScore: 30, rationale: 'Kamrej cluster aligns directly with Stop 1 -> Stop 2 highway transit vector.' },
      { label: 'Historical Agmark Reliability', weight: 25, score: 23.5, maxScore: 25, rationale: 'Keypad IVR responder with 100% on-time farm-gate dispatch history.' },
      { label: 'Batch Quota Fit', weight: 20, score: 18.9, maxScore: 20, rationale: '200 kg quota complements Ramesh Patel 300 kg to reach exactly 500 kg milestone.' },
      { label: 'Cold-Chain Freshness Buffer', weight: 15, score: 14.0, maxScore: 15, rationale: 'Harvest staged in ventilated crates under shade tree canopy.' },
      { label: 'Marginal Transport Cost', weight: 10, score: 9.2, maxScore: 10, rationale: 'Zero backtracking needed; vehicle stays along NH-48 feeder.' }
    ],
    algorithmDecision: 'Tier-1 Priority Primary Match (Selected for optimal multi-stop route continuity).'
  },
  'farmer-suresh': {
    farmerId: 'farmer-suresh',
    farmerName: 'Suresh Patel',
    village: 'Palsana (11.5 km)',
    overallScore: 89.6,
    factors: [
      { label: 'Geographic Proximity', weight: 30, score: 25.4, maxScore: 30, rationale: 'Palsana junction sits between Kamrej and Surat APMC hub return path.' },
      { label: 'Historical Agmark Reliability', weight: 25, score: 22.0, maxScore: 25, rationale: 'High volume supplier with consistent 94% Grade-A harvest score.' },
      { label: 'Batch Quota Fit', weight: 20, score: 19.8, maxScore: 20, rationale: '500 kg volume completes the remaining 50% quota to achieve 1,000 kg pool 100%.' },
      { label: 'Cold-Chain Freshness Buffer', weight: 15, score: 13.5, maxScore: 15, rationale: 'Adequate cold-chain margin for 90-minute morning transport window.' },
      { label: 'Marginal Transport Cost', weight: 10, score: 8.9, maxScore: 10, rationale: 'Adds 6.4 km to total route; acceptable within budget threshold.' }
    ],
    algorithmDecision: 'Volume-Anchor Match (Knapsack solver assigned 500 kg bulk quota).'
  },
  'farmer-jayesh': {
    farmerId: 'farmer-jayesh',
    farmerName: 'Jayesh Vasava',
    village: 'Bardoli (18.0 km)',
    overallScore: 88.0,
    factors: [
      { label: 'Geographic Proximity', weight: 30, score: 24.0, maxScore: 30, rationale: 'Pre-indexed standby buffer within 20 km regional perimeter.' },
      { label: 'Historical Agmark Reliability', weight: 25, score: 23.5, maxScore: 25, rationale: 'Certified Organic / IPM producer with 97% reliability rating.' },
      { label: 'Batch Quota Fit', weight: 20, score: 18.5, maxScore: 20, rationale: '500 kg standby reserve ready for zero-latency shortfall substitution.' },
      { label: 'Cold-Chain Freshness Buffer', weight: 15, score: 13.8, maxScore: 15, rationale: 'On-farm cold shed provides 24-hour holding capability.' },
      { label: 'Marginal Transport Cost', weight: 10, score: 8.2, maxScore: 10, rationale: 'Automated detour calculation reroutes truck with only +12 minutes delta.' }
    ],
    algorithmDecision: 'Automated Standby Reserve #1 (Pre-cleared fail-safe buffer candidate).'
  }
};
