import { Crop, Farmer, LogisticsFleet } from '../types';

export const BUYER_LOCATION = {
  lat: 21.1702,
  lng: 72.8311,
  name: 'Buyer Delivery Terminal (Wholesaler / Retailer)',
  city: 'Surat',
  state: 'Gujarat'
};

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'crop-tomato',
    name: 'Tomato (Tameta)',
    hindiName: 'टमाटर',
    gujaratiName: 'ટામેટાં',
    basePrice: 22.0,
    currentLivePrice: 22.4,
    priceHistory: [21.0, 21.5, 22.0, 22.8, 22.4],
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    unit: 'kg',
    perishability: 'High',
    pickupWindow: '4:00 AM – 5:00 AM',
    targetDeliveryTime: '7:00 AM'
  },
  {
    id: 'crop-potato',
    name: 'Potato (Bataka)',
    hindiName: 'आलू',
    gujaratiName: 'બટાકા',
    basePrice: 25.0,
    currentLivePrice: 25.5,
    priceHistory: [24.0, 24.5, 25.0, 25.2, 25.5],
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    unit: 'kg',
    perishability: 'Medium',
    pickupWindow: '5:30 AM – 6:30 AM',
    targetDeliveryTime: '8:30 AM'
  },
  {
    id: 'crop-onion',
    name: 'Onion (Dungri)',
    hindiName: 'प्याज',
    gujaratiName: 'ડુંગળી',
    basePrice: 28.0,
    currentLivePrice: 28.2,
    priceHistory: [27.0, 27.8, 28.0, 28.5, 28.2],
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    unit: 'kg',
    perishability: 'Medium',
    pickupWindow: '5:00 AM – 6:00 AM',
    targetDeliveryTime: '8:00 AM'
  },
  {
    id: 'crop-cabbage',
    name: 'Cabbage (Kobi)',
    hindiName: 'पत्तागोभी',
    gujaratiName: 'કોબીજ',
    basePrice: 18.0,
    currentLivePrice: 18.5,
    priceHistory: [17.5, 18.0, 18.2, 18.8, 18.5],
    image: 'https://images.unsplash.com/photo-1598030304671-5aa1d6f21128?auto=format&fit=crop&w=600&q=80',
    unit: 'kg',
    perishability: 'High',
    pickupWindow: '4:30 AM – 5:30 AM',
    targetDeliveryTime: '7:30 AM'
  },
  {
    id: 'crop-cauliflower',
    name: 'Cauliflower (Fulaver)',
    hindiName: 'फूलगोभी',
    gujaratiName: 'ફૂલકોબી',
    basePrice: 24.0,
    currentLivePrice: 23.8,
    priceHistory: [25.0, 24.5, 24.0, 23.5, 23.8],
    image: 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
    unit: 'kg',
    perishability: 'High',
    pickupWindow: '4:15 AM – 5:15 AM',
    targetDeliveryTime: '7:15 AM'
  }
];

export const INITIAL_FARMERS: Farmer[] = [
  // Primary Matched Trio for 1000 kg Tomato
  {
    id: 'farmer-ramesh',
    name: 'Ramesh Patel',
    village: 'Olpad',
    phone: '+91 98251 12345',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Tomato', 'Cabbage'],
    todayCrop: 'Tomato',
    todayAvailableQty: 300,
    offeredRate: 22.0,
    rating: 4.9,
    ordersCompleted: 18,
    location: {
      lat: 21.3323,
      lng: 72.7533,
      village: 'Olpad',
      taluka: 'Olpad',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 21.4
  },
  {
    id: 'farmer-mahesh',
    name: 'Mahesh Patel',
    village: 'Kamrej',
    phone: '+91 98252 23456',
    phoneType: 'KEYPAD',
    preferredLanguage: 'Hindi',
    cropsGrown: ['Tomato', 'Potato'],
    todayCrop: 'Tomato',
    todayAvailableQty: 200,
    offeredRate: 21.0,
    rating: 4.7,
    ordersCompleted: 14,
    location: {
      lat: 21.2707,
      lng: 72.9567,
      village: 'Kamrej',
      taluka: 'Kamrej',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 18.2
  },
  {
    id: 'farmer-suresh',
    name: 'Suresh Patel',
    village: 'Palsana',
    phone: '+91 98253 34567',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Tomato', 'Cauliflower'],
    todayCrop: 'Tomato',
    todayAvailableQty: 500,
    offeredRate: 22.0,
    rating: 4.8,
    ordersCompleted: 22,
    location: {
      lat: 21.0827,
      lng: 72.9961,
      village: 'Palsana',
      taluka: 'Palsana',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 19.8
  },

  // Standby Tomato Farmers (Ready to be dynamically replaced)
  {
    id: 'farmer-jayesh',
    name: 'Jayesh Vasava (Standby)',
    village: 'Bardoli',
    phone: '+91 98254 45678',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Tomato', 'Potato'],
    todayCrop: 'Tomato',
    todayAvailableQty: 400,
    offeredRate: 22.0,
    rating: 4.85,
    ordersCompleted: 29,
    location: {
      lat: 21.1197,
      lng: 73.1136,
      village: 'Bardoli',
      taluka: 'Bardoli',
      district: 'Surat'
    },
    isStandby: true,
    status: 'Standby',
    distanceKm: 31.0
  },
  {
    id: 'farmer-hasmukh',
    name: 'Hasmukh Bhai (Standby)',
    village: 'Mandvi',
    phone: '+91 98255 56789',
    phoneType: 'KEYPAD',
    preferredLanguage: 'Hindi',
    cropsGrown: ['Tomato', 'Onion'],
    todayCrop: 'Tomato',
    todayAvailableQty: 300,
    offeredRate: 21.5,
    rating: 4.65,
    ordersCompleted: 11,
    location: {
      lat: 21.2583,
      lng: 73.3031,
      village: 'Mandvi',
      taluka: 'Mandvi',
      district: 'Surat'
    },
    isStandby: true,
    status: 'Standby',
    distanceKm: 42.0
  },
  {
    id: 'farmer-naresh',
    name: 'Naresh Solanki (Standby)',
    village: 'Ankleshwar',
    phone: '+91 98256 67890',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Tomato', 'Cabbage'],
    todayCrop: 'Tomato',
    todayAvailableQty: 350,
    offeredRate: 22.5,
    rating: 4.75,
    ordersCompleted: 19,
    location: {
      lat: 21.6264,
      lng: 73.0019,
      village: 'Ankleshwar',
      taluka: 'Ankleshwar',
      district: 'Bharuch'
    },
    isStandby: true,
    status: 'Standby',
    distanceKm: 51.0
  },

  // Potato Farmers
  {
    id: 'farmer-dinesh',
    name: 'Dinesh Sharma',
    village: 'Sayan',
    phone: '+91 98257 78901',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Hindi',
    cropsGrown: ['Potato', 'Cauliflower'],
    todayCrop: 'Potato',
    todayAvailableQty: 500,
    offeredRate: 25.0,
    rating: 4.8,
    ordersCompleted: 21,
    location: {
      lat: 21.3125,
      lng: 72.8841,
      village: 'Sayan',
      taluka: 'Olpad',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 17.5
  },
  {
    id: 'farmer-rakesh',
    name: 'Rakesh Yadav',
    village: 'Kim',
    phone: '+91 98258 89012',
    phoneType: 'KEYPAD',
    preferredLanguage: 'Hindi',
    cropsGrown: ['Potato'],
    todayCrop: 'Potato',
    todayAvailableQty: 400,
    offeredRate: 24.5,
    rating: 4.5,
    ordersCompleted: 9,
    location: {
      lat: 21.3983,
      lng: 72.9234,
      village: 'Kim',
      taluka: 'Olpad',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 27.0
  },
  {
    id: 'farmer-arvind',
    name: 'Arvind Rathod',
    village: 'Mahuva',
    phone: '+91 98259 90123',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Potato', 'Tomato'],
    todayCrop: 'Potato',
    todayAvailableQty: 300,
    offeredRate: 25.0,
    rating: 4.7,
    ordersCompleted: 15,
    location: {
      lat: 21.0253,
      lng: 73.1611,
      village: 'Mahuva',
      taluka: 'Mahuva',
      district: 'Surat'
    },
    isStandby: true,
    status: 'Standby',
    distanceKm: 38.0
  },

  // Onion Farmers
  {
    id: 'farmer-bharat',
    name: 'Bharat Ahir',
    village: 'Kadodara',
    phone: '+91 98260 01234',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Onion', 'Tomato'],
    todayCrop: 'Onion',
    todayAvailableQty: 600,
    offeredRate: 28.0,
    rating: 4.9,
    ordersCompleted: 33,
    location: {
      lat: 21.1764,
      lng: 72.9691,
      village: 'Kadodara',
      taluka: 'Palsana',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 14.2
  },
  {
    id: 'farmer-mohanlal',
    name: 'Mohanlal Prajapati',
    village: 'Sachin',
    phone: '+91 98261 12340',
    phoneType: 'KEYPAD',
    preferredLanguage: 'Hindi',
    cropsGrown: ['Onion'],
    todayCrop: 'Onion',
    todayAvailableQty: 450,
    offeredRate: 27.5,
    rating: 4.6,
    ordersCompleted: 12,
    location: {
      lat: 21.0844,
      lng: 72.8617,
      village: 'Sachin',
      taluka: 'Chorasi',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 12.0
  },

  // Cabbage Farmers
  {
    id: 'farmer-paresh',
    name: 'Paresh Desai',
    village: 'Navsari',
    phone: '+91 98262 23451',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Cabbage', 'Cauliflower'],
    todayCrop: 'Cabbage',
    todayAvailableQty: 350,
    offeredRate: 18.0,
    rating: 4.8,
    ordersCompleted: 26,
    location: {
      lat: 20.9467,
      lng: 72.9520,
      village: 'Navsari',
      taluka: 'Navsari',
      district: 'Navsari'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 28.5
  },
  {
    id: 'farmer-pravin',
    name: 'Pravin Parmar',
    village: 'Maroli',
    phone: '+91 98263 34562',
    phoneType: 'KEYPAD',
    preferredLanguage: 'Gujarati',
    cropsGrown: ['Cabbage'],
    todayCrop: 'Cabbage',
    todayAvailableQty: 250,
    offeredRate: 17.5,
    rating: 4.5,
    ordersCompleted: 8,
    location: {
      lat: 21.0021,
      lng: 72.8711,
      village: 'Maroli',
      taluka: 'Jalalpore',
      district: 'Navsari'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 20.0
  },

  // Cauliflower Farmers
  {
    id: 'farmer-sanjay',
    name: 'Sanjay Chaudhary',
    village: 'Kosamba',
    phone: '+91 98264 45673',
    phoneType: 'SMARTPHONE',
    preferredLanguage: 'Hindi',
    cropsGrown: ['Cauliflower', 'Potato'],
    todayCrop: 'Cauliflower',
    todayAvailableQty: 400,
    offeredRate: 24.0,
    rating: 4.85,
    ordersCompleted: 24,
    location: {
      lat: 21.4642,
      lng: 72.9611,
      village: 'Kosamba',
      taluka: 'Mangrol',
      district: 'Surat'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 36.0
  },
  {
    id: 'farmer-bhavesh',
    name: 'Bhavesh Gondaliya',
    village: 'Valod',
    phone: '+91 98265 56784',
    phoneType: 'KEYPAD',
    preferredLanguage: 'Hindi',
    cropsGrown: ['Cauliflower'],
    todayCrop: 'Cauliflower',
    todayAvailableQty: 300,
    offeredRate: 23.5,
    rating: 4.6,
    ordersCompleted: 13,
    location: {
      lat: 21.0489,
      lng: 73.2433,
      village: 'Valod',
      taluka: 'Valod',
      district: 'Tapi'
    },
    isStandby: false,
    status: 'Pending',
    distanceKm: 48.0
  }
];

export const INITIAL_FLEET: LogisticsFleet = {
  fleetPartner: 'Mitti Logistics Cold-Chain Fleet',
  vehicleNumber: 'GJ-05-AB-1234',
  driverName: 'Arjun Singh',
  driverPhone: '+91 98251 04921',
  driverLicense: 'GJ05-2018-004921',
  driverRating: 4.9,
  vehicleType: 'Eicher Pro 2049 Refrigerated Reefer',
  capacityKg: 2500,
  currentLoadKg: 0,
  transportFeePerKg: 1.0, // Paid by buyer
  currentLocation: { lat: 21.1702, lng: 72.8311 },
  activeStopIndex: 0,
  pickupRunsActive: false,
  deliveryStatus: 'NOT_STARTED',
  speedKmH: 0,
  reeferTempC: 17.8,
  reeferHumidityPercent: 88,
  fuelBatteryPercent: 84,
  estimatedDeliveryTime: '06:30 AM',
  currentSegmentName: 'Standby at Buyer Delivery Terminal'
};
