import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ModuleTab,
  Crop,
  Farmer,
  BuyerDemand,
  PoolContributor,
  ConsolidatedInvoice,
  PickupStop,
  LogisticsFleet,
  MatchingLogEvent,
  NotificationToast,
  QualityGrade,
  QualityCheckData,
  ShortageEvent
} from '../types';
import {
  INITIAL_CROPS,
  INITIAL_FARMERS,
  INITIAL_FLEET,
  BUYER_LOCATION
} from '../data/mockDatabase';
import {
  calculateFarmerMatchScore,
  findPoolingCombination,
  findStandbyReplacement,
  adjustRateByQuality
} from '../utils/matchingEngine';
import { sounds } from '../utils/audioChimes';

export type DemoSpeed = 'Normal' | 'Fast' | 'Instant';

export interface AutoDemoStepInfo {
  stepIndex: number;
  totalSteps: number;
  title: string;
  explanation: string;
  targetTab: ModuleTab;
}

interface DemoContextType {
  activeTab: ModuleTab;
  setActiveTab: (tab: ModuleTab) => void;
  demoSpeed: DemoSpeed;
  setDemoSpeed: (speed: DemoSpeed) => void;
  isAutoDemoRunning: boolean;
  currentAutoDemoStep: AutoDemoStepInfo | null;
  stopAutoDemo: () => void;

  // Domain state
  crops: Crop[];
  farmers: Farmer[];
  selectedFarmerId: string;
  setSelectedFarmerId: (id: string) => void;
  activeDemand: BuyerDemand | null;
  poolContributors: PoolContributor[];
  isMatchingActive: boolean;
  radarScanningLabel: string;
  consolidatedInvoice: ConsolidatedInvoice | null;
  fleet: LogisticsFleet;
  pickupStops: PickupStop[];
  matchingLogs: MatchingLogEvent[];
  toasts: NotificationToast[];

  // Shortage and Doorstep states
  shortageEvent: ShortageEvent | null;
  transitSecondsRemaining: number;
  isTransitCountdownActive: boolean;
  fastForwardTransitToDoorstep: () => void;
  isDoorstepPendingAcceptance: boolean;
  acceptDoorstepDeliveryAndRelease30Percent: () => void;

  // Farmers simulator UI states
  incomingCallActive: boolean;
  setIncomingCallActive: (active: boolean) => void;
  ivrStep: number;
  setIvrStep: (step: number) => void;

  // Actions
  postDemand: (params: {
    crops: { cropId: string; quantity: number }[];
    acceptExtra10Percent: boolean;
    pickupWindow: string;
    deliveryRequiredBy: string;
    buyerName?: string;
  }) => void;

  farmerAccept: (farmerId: string) => void;
  farmerReject: (farmerId: string, reason?: string) => void;
  farmerCounterOffer: (farmerId: string, counterRate: number) => void;
  confirmOrderAndLockEscrow: () => void;
  startPickupRun: () => void;
  arriveAtStop: (stopId: string) => void;
  submitStopQC: (params: {
    stopId: string;
    actualWeight: number;
    grade: QualityGrade;
    checkboxes: {
      sizeUniform: boolean;
      noRottenProduce: boolean;
      colorAcceptable: boolean;
      ripenessAcceptable: boolean;
      packagingAcceptable: boolean;
    };
    aiNotes?: string;
  }) => void;
  completeFinalDelivery: () => void;
  runFullDemo: () => void;
  restartDemo: () => void;
  dismissToast: (id: string) => void;
  addToast: (message: string, severity?: 'info' | 'success' | 'warning' | 'error') => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('buyer');
  const [demoSpeed, setDemoSpeed] = useState<DemoSpeed>('Normal');
  const [isAutoDemoRunning, setIsAutoDemoRunning] = useState<boolean>(false);

  const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('farmer-ramesh');
  const [activeDemand, setActiveDemand] = useState<BuyerDemand | null>(null);
  const [poolContributors, setPoolContributors] = useState<PoolContributor[]>([]);
  const [isMatchingActive, setIsMatchingActive] = useState<boolean>(false);
  const [radarScanningLabel, setRadarScanningLabel] = useState<string>('');
  const [consolidatedInvoice, setConsolidatedInvoice] = useState<ConsolidatedInvoice | null>(null);
  const [fleet, setFleet] = useState<LogisticsFleet>(INITIAL_FLEET);
  const [pickupStops, setPickupStops] = useState<PickupStop[]>([]);
  const [matchingLogs, setMatchingLogs] = useState<MatchingLogEvent[]>([]);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  // Shortage, transit and doorstep states
  const [shortageEvent, setShortageEvent] = useState<ShortageEvent | null>(null);
  const [transitSecondsRemaining, setTransitSecondsRemaining] = useState<number>(30);
  const [isTransitCountdownActive, setIsTransitCountdownActive] = useState<boolean>(false);
  const [isDoorstepPendingAcceptance, setIsDoorstepPendingAcceptance] = useState<boolean>(false);
  const transitTimerRef = useRef<any>(null);

  // Keypad simulator states
  const [incomingCallActive, setIncomingCallActive] = useState<boolean>(false);
  const [ivrStep, setIvrStep] = useState<number>(0);

  const autoDemoTimerRef = useRef<any[]>([]);

  // Doorstep arrival trigger
  const triggerDoorstepArrival = () => {
    setIsTransitCountdownActive(false);
    setTransitSecondsRemaining(0);
    setActiveTab('buyer');
    setFleet((prev) => ({
      ...prev,
      deliveryStatus: 'ARRIVED_AT_DOORSTEP',
      currentLocation: BUYER_LOCATION
    }));
    setIsDoorstepPendingAcceptance(true);
    sounds.playNotificationChime();
    addToast('🚚 Order has arrived at your facility doorstep (Surat APMC). Please inspect and accept remaining 30% payment.', 'success');
    addLog('🚚 Order arrived at Buyer Facility Doorstep (Surat APMC Central Bulk Bay 4). Awaiting buyer acceptance for remaining 30% escrow.', 'LOGISTICS', 'success');
  };

  // Fast forward transit directly to buyer doorstep
  const fastForwardTransitToDoorstep = () => {
    if (transitTimerRef.current) clearTimeout(transitTimerRef.current);
    triggerDoorstepArrival();
  };

  // Doorstep acceptance & final 30% release
  const acceptDoorstepDeliveryAndRelease30Percent = () => {
    setIsDoorstepPendingAcceptance(false);
    completeFinalDelivery();
  };

  // 2-Minute simulated transit countdown effect (with demo speed scaling)
  useEffect(() => {
    if (isTransitCountdownActive && transitSecondsRemaining > 0) {
      const stepMs = demoSpeed === 'Instant' ? 30 : demoSpeed === 'Fast' ? 250 : 1000;
      transitTimerRef.current = setTimeout(() => {
        setTransitSecondsRemaining((prev) => {
          if (prev <= 1) {
            triggerDoorstepArrival();
            return 0;
          }
          return prev - 1;
        });
      }, stepMs);
      return () => {
        if (transitTimerRef.current) clearTimeout(transitTimerRef.current);
      };
    }
  }, [isTransitCountdownActive, transitSecondsRemaining, demoSpeed]);

  // Multiplier based on speed: Normal = 1x, Fast = 0.35x, Instant = 0.05x
  const getDelay = (baseMs: number) => {
    if (demoSpeed === 'Instant') return 80;
    if (demoSpeed === 'Fast') return Math.max(150, Math.round(baseMs * 0.35));
    return baseMs;
  };

  const addToast = (message: string, severity: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, severity, timestamp: new Date().toLocaleTimeString() }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addLog = (
    message: string,
    category: MatchingLogEvent['category'] = 'MATCH',
    severity: MatchingLogEvent['severity'] = 'info'
  ) => {
    const now = new Date();
    const timeFormatted = now.toTimeString().split(' ')[0];
    const newLog: MatchingLogEvent = {
      id: 'log-' + Math.random().toString(36).substring(2, 9),
      timestamp: now.toISOString(),
      timeFormatted,
      message,
      category,
      severity
    };
    setMatchingLogs((prev) => [newLog, ...prev]);
  };

  // Live market price simulated hourly fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCrops((prevCrops) =>
        prevCrops.map((crop) => {
          // slight random jitter between -0.4 and +0.4
          const jitter = Math.round((Math.random() * 0.8 - 0.4) * 10) / 10;
          const newPrice = Math.max(crop.basePrice * 0.8, Math.round((crop.currentLivePrice + jitter) * 10) / 10);
          const history = [...crop.priceHistory.slice(1), newPrice];
          return {
            ...crop,
            currentLivePrice: newPrice,
            priceHistory: history
          };
        })
      );
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 1. Post Demand & Trigger Matching Sequence
  const postDemand = ({
    crops: selectedCropsList,
    acceptExtra10Percent,
    pickupWindow,
    deliveryRequiredBy,
    buyerName = 'Nature Fresh Supermarkets Ltd'
  }: {
    crops: { cropId: string; quantity: number }[];
    acceptExtra10Percent: boolean;
    pickupWindow: string;
    deliveryRequiredBy: string;
    buyerName?: string;
  }) => {
    const demandCrops = selectedCropsList.map((sc) => {
      const cr = crops.find((c) => c.id === sc.cropId) || crops[0];
      return {
        cropId: cr.id,
        cropName: cr.name.split(' ')[0], // e.g. "Tomato"
        quantity: sc.quantity,
        pricePerKg: cr.currentLivePrice
      };
    });

    const totalTarget = demandCrops.reduce((sum, c) => sum + c.quantity, 0);
    const demandId = 'MM-' + Math.floor(1000 + Math.random() * 9000);

    const newDemand: BuyerDemand = {
      id: demandId,
      buyerName,
      crops: demandCrops,
      acceptExtra10Percent,
      pickupWindow,
      deliveryRequiredBy,
      deliveryDate: 'Today / Early Morning',
      postedAt: new Date().toLocaleTimeString(),
      targetTotalKg: totalTarget
    };

    setActiveDemand(newDemand);
    setConsolidatedInvoice(null);
    setPickupStops([]);
    setFleet(INITIAL_FLEET);

    addToast('Demand posted successfully.', 'success');
    addLog(`Demand received: ${demandCrops.map((c) => `${c.cropName} — ${c.quantity} kg`).join(', ')}`, 'MATCH', 'info');

    // UI sequence
    setIsMatchingActive(true);
    setRadarScanningLabel('Scanning nearby supply within 15 km...');
    addLog('Searching within 10–15 km around Surat agro cluster...', 'MATCH', 'info');
    addLog('Quality filter applied: Grade A Certified', 'MATCH', 'info');

    // Step 2: Discover and score farmers for the primary crop (e.g. Tomato 1000 kg)
    const primaryCrop = demandCrops[0].cropName;
    const primaryTarget = demandCrops[0].quantity;

    setTimeout(() => {
      setRadarScanningLabel(`3 suitable farmers found for ${primaryCrop}...`);
      addLog(`Ramesh Patel matched: 300 kg (Match Score: 92%)`, 'FARMER', 'success');
      addLog(`Mahesh Patel matched: 200 kg (Match Score: 86%)`, 'FARMER', 'success');
      addLog(`Suresh Patel matched: 500 kg (Match Score: 81%)`, 'FARMER', 'success');

      // Update farmers state to show matched alerts
      setFarmers((prev) =>
        prev.map((f) => {
          if (['farmer-ramesh', 'farmer-mahesh', 'farmer-suresh'].includes(f.id)) {
            const score = calculateFarmerMatchScore(f, primaryCrop, primaryTarget);
            return {
              ...f,
              status: 'Pending',
              matchScore: score
            };
          }
          return f;
        })
      );
    }, getDelay(900));

    // Step 3: Pooling available supply
    setTimeout(() => {
      setRadarScanningLabel(`Pooling available supply (300 + 200 + 500 = ${primaryTarget} kg)...`);
      addLog(`Potential pool: 300 + 200 + 500 = 1000 kg`, 'POOL', 'info');
      addLog('Automated dispatch notifications triggered to farmer phones.', 'FARMER', 'info');

      // Create pool contributors
      const initialPool: PoolContributor[] = [
        {
          farmerId: 'farmer-ramesh',
          farmerName: 'Ramesh Patel',
          village: 'Olpad',
          crop: primaryCrop,
          availableQty: 300,
          allocatedQty: 300,
          offeredRate: 22.0,
          status: 'Pending',
          phoneType: 'SMARTPHONE',
          preferredLanguage: 'Gujarati'
        },
        {
          farmerId: 'farmer-mahesh',
          farmerName: 'Mahesh Patel',
          village: 'Kamrej',
          crop: primaryCrop,
          availableQty: 200,
          allocatedQty: 200,
          offeredRate: 21.0,
          status: 'Pending',
          phoneType: 'KEYPAD',
          preferredLanguage: 'Hindi'
        },
        {
          farmerId: 'farmer-suresh',
          farmerName: 'Suresh Patel',
          village: 'Palsana',
          crop: primaryCrop,
          availableQty: 500,
          allocatedQty: 500,
          offeredRate: 22.0,
          status: 'Pending',
          phoneType: 'SMARTPHONE',
          preferredLanguage: 'Gujarati'
        }
      ];

      setPoolContributors(initialPool);
      setIsMatchingActive(false);
      setRadarScanningLabel('');
      addToast('3 nearby farmers matched. Awaiting acceptance.', 'info');
      sounds.playNotificationChime();
    }, getDelay(2000));
  };

  // 2. Check if all pool items are accepted, and generate consolidated invoice
  const recalculatePoolAndInvoice = (updatedPool: PoolContributor[]) => {
    setPoolContributors(updatedPool);

    const acceptedContributors = updatedPool.filter((c) => c.status === 'Accepted');
    const totalAcceptedKg = acceptedContributors.reduce((sum, c) => sum + c.allocatedQty, 0);
    const targetKg = activeDemand ? activeDemand.targetTotalKg : 1000;

    if (totalAcceptedKg >= targetKg) {
      // 100% pool filled! Generate Consolidated Invoice
      sounds.playSuccessChime();
      addToast(`Pool reached ${targetKg} kg! Consolidated invoice generated.`, 'success');
      addLog(`Pool confirmed 100%: ${targetKg}/${targetKg} kg`, 'POOL', 'success');

      const produceSubtotal = acceptedContributors.reduce(
        (sum, c) => sum + c.allocatedQty * c.offeredRate,
        0
      );
      const logisticsFee = totalAcceptedKg * 1.0; // ₹1/kg paid by buyer
      const handlingFee = Math.round(produceSubtotal * 0.02); // 2%
      const totalPayable = produceSubtotal + logisticsFee + handlingFee;
      const escrow70PercentHold = Math.round(totalPayable * 0.7);
      const escrow30PercentFinal = totalPayable - escrow70PercentHold;

      const invoice: ConsolidatedInvoice = {
        orderId: activeDemand?.id || 'MM1024',
        buyerName: activeDemand?.buyerName || 'Nature Fresh Supermarkets Ltd',
        cropsSummary: activeDemand?.crops.map((c) => `${c.quantity} kg ${c.cropName}`).join(', ') || '1000 kg Tomato',
        contributors: acceptedContributors,
        totalKg: totalAcceptedKg,
        produceSubtotal,
        logisticsFee,
        handlingFee,
        totalPayable,
        escrow70PercentHold,
        escrow30PercentFinal,
        isConfirmed: false,
        escrowStatus: 'UNFUNDED'
      };

      setConsolidatedInvoice(invoice);
    }
  };

  // 3. Farmer Acceptance
  const farmerAccept = (farmerId: string) => {
    sounds.playNotificationChime();
    const farmer = farmers.find((f) => f.id === farmerId);
    const farmerName = farmer?.name || farmerId;

    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status: 'Accepted' } : f))
    );

    const updated = poolContributors.map((c) =>
      c.farmerId === farmerId ? { ...c, status: 'Accepted' as const } : c
    );

    addLog(`${farmerName} ACCEPTED the demand (${farmer?.todayAvailableQty || 0} kg).`, 'FARMER', 'success');
    addToast(`${farmerName} has accepted the demand.`, 'success');

    recalculatePoolAndInvoice(updated);
  };

  // 4. Farmer Rejection & Dynamic Standby Replacement
  const farmerReject = (farmerId: string, reason: string = 'Harvesting delay') => {
    const farmer = farmers.find((f) => f.id === farmerId);
    const farmerName = farmer?.name || farmerId;
    const rejectedContrib = poolContributors.find((c) => c.farmerId === farmerId);
    const rejectedKg = rejectedContrib ? rejectedContrib.allocatedQty : (farmer?.todayAvailableQty || 300);

    // Update rejected farmer node to RED
    setFarmers((prev) =>
      prev.map((f) => (f.id === farmerId ? { ...f, status: 'Rejected' } : f))
    );

    addLog(`${farmerName} REJECTED demand. Reason: "${reason}".`, 'FARMER', 'error');
    addToast(`${farmerName} rejected the demand.`, 'error');

    // Trigger Standby Replacement
    addLog(`${rejectedKg} kg shortage detected in pool.`, 'STANDBY', 'warning');
    addLog('Searching standby reserve supply in adjacent villages...', 'STANDBY', 'info');
    addToast(`Searching standby supply for ${rejectedKg} kg...`, 'warning');

    setTimeout(() => {
      // Find eligible standby farmer
      const currentAssigned = poolContributors.map((c) => c.farmerId);
      const standby = findStandbyReplacement(
        farmers,
        rejectedContrib?.crop || 'Tomato',
        rejectedKg,
        currentAssigned
      );

      if (standby) {
        addLog(`Standby Farmer ${standby.name} (${standby.village}) matched for ${rejectedKg} kg!`, 'STANDBY', 'success');
        addToast(`Standby Farmer ${standby.name} allocated!`, 'info');

        // Update standby farmer in farmer list
        setFarmers((prev) =>
          prev.map((f) =>
            f.id === standby.id ? { ...f, status: 'Pending', isStandby: false } : f
          )
        );

        // Replace row in pool
        const updatedPool: PoolContributor[] = poolContributors.map((c) => {
          if (c.farmerId === farmerId) {
            return {
              farmerId: standby.id,
              farmerName: `${standby.name} (Standby Backup)`,
              village: standby.village,
              crop: c.crop,
              availableQty: standby.todayAvailableQty,
              allocatedQty: rejectedKg,
              offeredRate: standby.offeredRate,
              status: 'Pending' as const,
              phoneType: standby.phoneType,
              preferredLanguage: standby.preferredLanguage,
              isStandbyBackup: true,
              rejectionReason: reason
            };
          }
          return c;
        });

        setPoolContributors(updatedPool);

        // Select standby farmer so their device opens in farmer module
        setSelectedFarmerId(standby.id);

        // Auto accept standby only if automated full demo is running
        if (isAutoDemoRunning) {
          setTimeout(() => {
            farmerAccept(standby.id);
          }, getDelay(1500));
        }
      } else {
        addLog('No immediate standby farmer available.', 'STANDBY', 'error');
      }
    }, getDelay(1200));
  };

  // 5. Counter Offer
  const farmerCounterOffer = (farmerId: string, counterRate: number) => {
    const farmer = farmers.find((f) => f.id === farmerId);
    setFarmers((prev) =>
      prev.map((f) =>
        f.id === farmerId
          ? { ...f, status: 'Counter Offer', counterOfferRate: counterRate }
          : f
      )
    );
    setPoolContributors((prev) =>
      prev.map((c) =>
        c.farmerId === farmerId
          ? { ...c, status: 'Counter Offer', offeredRate: counterRate }
          : c
      )
    );
    addLog(`${farmer?.name} proposed counter rate: ₹${counterRate}/kg`, 'FARMER', 'warning');
    addToast(`${farmer?.name} proposed ₹${counterRate}/kg counter offer.`, 'info');
  };

  // 6. Confirm Order & Lock Escrow
  const confirmOrderAndLockEscrow = () => {
    if (!consolidatedInvoice) return;

    sounds.playSuccessChime();
    setConsolidatedInvoice((prev) => (prev ? { ...prev, isConfirmed: true, escrowStatus: '70%_HELD' } : null));

    addLog(`🎉 Order Confirmed #${consolidatedInvoice.orderId}`, 'ORDER', 'success');
    addLog(`70% Escrow Amount (₹${consolidatedInvoice.escrow70PercentHold.toLocaleString('en-IN')}) placed on hold.`, 'ESCROW', 'success');
    addLog('Truck booking initiated (Vehicle GJ-05-AB-1234 allocated).', 'LOGISTICS', 'info');
    addLog('Pickup schedule dispatched to all participating farmers.', 'LOGISTICS', 'info');

    addToast('🎉 Order Confirmed! 70% Escrow placed on hold.', 'success');
    addToast('Truck booking initiated. Farmers notified.', 'info');

    // Generate Pickup Stops
    const stops: PickupStop[] = consolidatedInvoice.contributors.map((contrib, index) => {
      const f = farmers.find((farm) => farm.id === contrib.farmerId);
      const loc = f ? f.location : { lat: 21.3323, lng: 72.7533, village: contrib.village, taluka: 'Surat', district: 'Surat' };
      const hours = 4;
      const mins = index * 20;
      const timeStr = `${hours}:${mins < 10 ? '0' : ''}${mins} AM`;

      return {
        id: `stop-${index + 1}`,
        stopNumber: index + 1,
        farmerId: contrib.farmerId,
        farmerName: contrib.farmerName,
        village: contrib.village,
        crop: contrib.crop,
        promisedQty: contrib.allocatedQty,
        distanceKm: f?.distanceKm || 15 + index * 4,
        eta: timeStr,
        status: 'PENDING',
        location: loc
      };
    });

    setPickupStops(stops);
  };

  // 7. Logistics: Start Pickup Run
  const startPickupRun = () => {
    if (pickupStops.length === 0) return;

    setFleet((prev) => ({
      ...prev,
      pickupRunsActive: true,
      deliveryStatus: 'PICKUP_STARTED',
      activeStopIndex: 0
    }));

    addLog('Perishable crop priority route initiated (Optimized for 4:00 AM freshness).', 'LOGISTICS', 'info');
    addLog(`Truck GJ-05-AB-1234 departing toward Stop 1 (${pickupStops[0].farmerName}, ${pickupStops[0].village}).`, 'LOGISTICS', 'info');
    addToast('Pickup run started! Truck departing toward Stop 1.', 'info');

    // Set first stop to ARRIVING then ARRIVED
    setTimeout(() => {
      arriveAtStop(pickupStops[0].id);
    }, getDelay(1200));
  };

  // 8. Arrive at Stop
  const arriveAtStop = (stopId: string) => {
    setPickupStops((prev) =>
      prev.map((s) => (s.id === stopId ? { ...s, status: 'ARRIVED' } : s))
    );
    const stop = pickupStops.find((s) => s.id === stopId);
    if (stop) {
      setFleet((prev) => ({
        ...prev,
        currentLocation: { lat: stop.location.lat, lng: stop.location.lng },
        deliveryStatus: 'AT_STOP'
      }));
      addLog(`Driver Arjun Singh arrived at Stop ${stop.stopNumber}: ${stop.farmerName} (${stop.village}).`, 'LOGISTICS', 'info');
      addToast(`Driver arrived at ${stop.farmerName}'s farm in ${stop.village}.`, 'info');
    }
  };

  // 9. Submit Stop Quality Check & Weight Inspection
  const submitStopQC = ({
    stopId,
    actualWeight,
    grade,
    checkboxes,
    aiNotes = 'AI Vision: Produce certified fresh, no rot or excessive bruising detected.'
  }: {
    stopId: string;
    actualWeight: number;
    grade: QualityGrade;
    checkboxes: {
      sizeUniform: boolean;
      noRottenProduce: boolean;
      colorAcceptable: boolean;
      ripenessAcceptable: boolean;
      packagingAcceptable: boolean;
    };
    aiNotes?: string;
  }) => {
    const stopIndex = pickupStops.findIndex((s) => s.id === stopId);
    if (stopIndex === -1) return;
    const currentStop = pickupStops[stopIndex];
    const promised = currentStop.promisedQty;
    const shortfall = Math.max(0, promised - actualWeight);

    // Calculate quality price adjustment
    const baseRate = 22.0;
    const adjustedRate = adjustRateByQuality(baseRate, grade);
    const isQualityFailed = grade === 'Failed';

    const qcResult: QualityCheckData = {
      farmerId: currentStop.farmerId,
      promisedWeight: promised,
      actualWeight,
      promisedGrade: 'A',
      actualGrade: grade,
      adjustedRate,
      checks: checkboxes,
      aiImageVerified: !isQualityFailed,
      aiNotes,
      shortfallKg: shortfall,
      status: isQualityFailed ? 'QUALITY_RISK_REPLACED' : 'PASSED'
    };

    if (isQualityFailed) {
      addLog(`Quality risk detected at Stop ${currentStop.stopNumber} (${currentStop.farmerName}). Produce rejected!`, 'QC', 'error');
      addToast(`Quality failed for ${currentStop.farmerName}. Replacement standby farmer activated!`, 'error');

      // Standby replacement for failed QC
      const standby = findStandbyReplacement(farmers, currentStop.crop, promised, [currentStop.farmerId]);
      if (standby) {
        addLog(`Replacement standby farmer ${standby.name} activated for ${promised} kg.`, 'STANDBY', 'warning');
      }

      setPickupStops((prev) =>
        prev.map((s) => (s.id === stopId ? { ...s, status: 'SKIPPED_REPLACED', qcResult } : s))
      );
    } else {
      // Normal Passed QC
      addLog(`Stop ${currentStop.stopNumber} Verified: ${actualWeight} kg | Grade ${grade} | Rate: ₹${adjustedRate}/kg`, 'QC', 'success');
      addToast(`Stop ${currentStop.stopNumber} QC passed! (${actualWeight} kg verified)`, 'success');

      // Shortfall check and standby redirection
      let updatedStops = pickupStops.map((s) => (s.id === stopId ? { ...s, status: 'COMPLETED' as const, qcResult } : s));

      if (shortfall > 0) {
        const standby =
          findStandbyReplacement(farmers, currentStop.crop, shortfall, [currentStop.farmerId]) ||
          farmers.find((f) => f.isStandby && f.todayCrop === currentStop.crop) ||
          farmers[3];

        const shortageInfo: ShortageEvent = {
          originalFarmerId: currentStop.farmerId,
          originalFarmerName: currentStop.farmerName,
          village: currentStop.village,
          crop: currentStop.crop,
          promisedQty: promised,
          actualWeight,
          shortfallKg: shortfall,
          standbyFarmerId: standby.id,
          standbyFarmerName: standby.name.replace(' (Standby)', ''),
          standbyVillage: standby.village,
          timestamp: new Date().toLocaleTimeString()
        };
        setShortageEvent(shortageInfo);

        addLog(`Shortfall of ${shortfall} kg detected at Stop ${currentStop.stopNumber} (${currentStop.farmerName}). Truck dynamically re-routed to standby farmer ${standby.name.replace(' (Standby)', '')} (${standby.village})!`, 'LOGISTICS', 'warning');
        addToast(`⚠️ Shortfall of ${shortfall} kg at Stop ${currentStop.stopNumber}. Truck re-routed to standby farmer ${standby.name.replace(' (Standby)', '')}!`, 'warning');

        // Dynamically append standby pickup stop if not already added
        const alreadyHasStandbyStop = updatedStops.some((s) => s.farmerId === standby.id && s.promisedQty === shortfall);
        if (!alreadyHasStandbyStop) {
          const standbyStop: PickupStop = {
            id: 'stop-standby-' + Math.random().toString(36).substring(2, 7),
            stopNumber: updatedStops.length + 1,
            farmerId: standby.id,
            farmerName: `${standby.name.replace(' (Standby)', '')} (Standby Shortfall Pickup)`,
            village: standby.village,
            crop: currentStop.crop,
            promisedQty: shortfall,
            distanceKm: standby.distanceKm || 31.0,
            eta: '05:45 AM',
            status: 'PENDING',
            location: standby.location
          };
          updatedStops.push(standbyStop);
        }

        // Dynamically update the Consolidated Invoice to reflect actual weights and standby addition
        setConsolidatedInvoice((prev) => {
          if (!prev) return null;
          let updatedContributors = prev.contributors.map((c) => {
            if (c.farmerId === currentStop.farmerId) {
              return {
                ...c,
                allocatedQty: actualWeight,
                actualVerifiedWeight: actualWeight,
                verifiedGrade: grade,
                adjustedRate: adjustedRate,
                payoutAmount: actualWeight * adjustedRate
              };
            }
            return c;
          });

          const standbyExists = updatedContributors.some((c) => c.farmerId === standby.id);
          if (!standbyExists) {
            updatedContributors.push({
              farmerId: standby.id,
              farmerName: `${standby.name.replace(' (Standby)', '')} (Standby Shortfall Pickup)`,
              village: standby.village,
              crop: currentStop.crop,
              availableQty: standby.todayAvailableQty,
              allocatedQty: shortfall,
              offeredRate: standby.offeredRate,
              status: 'Accepted',
              phoneType: standby.phoneType,
              preferredLanguage: standby.preferredLanguage,
              isStandbyBackup: true,
              actualVerifiedWeight: shortfall,
              verifiedGrade: 'A',
              adjustedRate: standby.offeredRate,
              payoutAmount: shortfall * standby.offeredRate
            });
          }

          const newSubtotal = updatedContributors.reduce((sum, c) => sum + (c.allocatedQty * c.offeredRate), 0);
          const newLogisticsFee = prev.totalKg * 1.0;
          const newHandlingFee = Math.round(newSubtotal * 0.02);
          const newTotalPayable = newSubtotal + newLogisticsFee + newHandlingFee;
          const new70 = Math.round(newTotalPayable * 0.7);
          const new30 = newTotalPayable - new70;

          return {
            ...prev,
            contributors: updatedContributors,
            produceSubtotal: newSubtotal,
            logisticsFee: newLogisticsFee,
            handlingFee: newHandlingFee,
            totalPayable: newTotalPayable,
            escrow70PercentHold: new70,
            escrow30PercentFinal: new30
          };
        });
      }

      setPickupStops(updatedStops);

      // Update fleet load
      setFleet((prev) => ({
        ...prev,
        currentLoadKg: prev.currentLoadKg + actualWeight
      }));

      // If next stop exists, move to it; otherwise proceed to 2-minute transit countdown
      const nextIndex = stopIndex + 1;
      if (nextIndex < updatedStops.length) {
        setTimeout(() => {
          const nextStop = updatedStops[nextIndex];
          setFleet((prev) => ({ ...prev, activeStopIndex: nextIndex, deliveryStatus: 'PICKUP_STARTED' }));
          addLog(`Departing Stop ${currentStop.stopNumber} → Heading to Stop ${nextIndex + 1} (${nextStop.farmerName}, ${nextStop.village}).`, 'LOGISTICS', 'info');
          addToast(`Moving to Stop ${nextIndex + 1}: ${nextStop.farmerName}`, 'info');

          setTimeout(() => {
            arriveAtStop(nextStop.id);
          }, getDelay(1500));
        }, getDelay(1000));
      } else {
        // All stops completed!
        addLog('All farm-gate pickups completed & verified. 70% Escrow release triggered to farmers!', 'ESCROW', 'success');
        addToast('70% Escrow released to farmers! Truck heading to buyer warehouse.', 'success');

        setConsolidatedInvoice((prev) => (prev ? { ...prev, escrowStatus: '70%_RELEASED_QC' } : null));

        setFleet((prev) => ({
          ...prev,
          deliveryStatus: 'ON_THE_WAY'
        }));

        // Redirect immediately to Buyer Delivery Status & start 30-sec transit countdown
        setActiveTab('buyer');
        setTransitSecondsRemaining(30);
        setIsTransitCountdownActive(true);
        addLog('Consolidated 1000 kg load in transit to Buyer Facility (Surat APMC). Estimated transit: 30 seconds.', 'LOGISTICS', 'info');
        addToast('All farm pickups done! Redirecting to Buyer Delivery Status (30s highway transit)...', 'info');
      }
      return;
    }

    // If quality failed and next stop exists
    const nextIndex = stopIndex + 1;
    if (nextIndex < pickupStops.length) {
      setTimeout(() => {
        const nextStop = pickupStops[nextIndex];
        setFleet((prev) => ({ ...prev, activeStopIndex: nextIndex, deliveryStatus: 'PICKUP_STARTED' }));
        addLog(`Departing Stop ${currentStop.stopNumber} → Heading to Stop ${nextIndex + 1} (${nextStop.farmerName}, ${nextStop.village}).`, 'LOGISTICS', 'info');
        addToast(`Moving to Stop ${nextIndex + 1}: ${nextStop.farmerName}`, 'info');

        setTimeout(() => {
          arriveAtStop(nextStop.id);
        }, getDelay(1500));
      }, getDelay(1000));
    } else {
      // All stops completed!
      addLog('All farm-gate pickups completed & verified. 70% Escrow release triggered to farmers!', 'ESCROW', 'success');
      addToast('70% Escrow released to farmers! Truck heading to buyer warehouse.', 'success');

      setConsolidatedInvoice((prev) => (prev ? { ...prev, escrowStatus: '70%_RELEASED_QC' } : null));

      setFleet((prev) => ({
        ...prev,
        deliveryStatus: 'ON_THE_WAY'
      }));

      // Start 2-minute transit countdown to buyer doorstep
      setTransitSecondsRemaining(120);
      setIsTransitCountdownActive(true);
      addLog('Consolidated 1000 kg load in transit to Buyer Facility (Surat APMC). Estimated transit: 2:00 minutes.', 'LOGISTICS', 'info');
      addToast('All stops collected! Truck en route to buyer. Auto-redirect in 2 mins (or click Fast-Forward).', 'info');
    }
  };

  // 10. Complete Final Delivery & Remaining 30% Escrow Settlement
  const completeFinalDelivery = () => {
    sounds.playSuccessChime();

    setFleet((prev) => ({
      ...prev,
      deliveryStatus: 'DELIVERED',
      currentLocation: BUYER_LOCATION
    }));

    setConsolidatedInvoice((prev) =>
      prev ? { ...prev, escrowStatus: '100%_SETTLED' } : null
    );

    addLog('🚚 Order Arrived at Buyer Warehouse. Delivery signed & verified.', 'LOGISTICS', 'success');
    addLog('Remaining 30% payment initiated to all farmers via UPI / Bank transfer.', 'ESCROW', 'success');

    addToast('🚚 Delivery confirmed! Remaining 30% payment released to farmers.', 'success');
  };

  // 11. Run Full Demo (Slow, Step-by-Step Educational Guided Tour)
  const [currentAutoDemoStep, setCurrentAutoDemoStep] = useState<AutoDemoStepInfo | null>(null);

  const stopAutoDemo = () => {
    autoDemoTimerRef.current.forEach(clearTimeout);
    autoDemoTimerRef.current = [];
    setIsAutoDemoRunning(false);
    setCurrentAutoDemoStep(null);
    addToast('Auto demo tour stopped.', 'info');
  };

  const runFullDemo = () => {
    restartDemo();
    setIsAutoDemoRunning(true);

    // STEP 1: Buyer Posts 1,000 kg Demand (0.5s)
    const t1 = setTimeout(() => {
      setActiveTab('buyer');
      setCurrentAutoDemoStep({
        stepIndex: 1,
        totalSteps: 12,
        title: '1. Buyer Posts 1,000 kg Demand',
        explanation: 'Institutional buyer Nature Fresh Supermarkets Ltd posts a bulk requisition for 1,000 kg Tomato. Individual smallholders cannot supply this volume alone.',
        targetTab: 'buyer'
      });

      postDemand({
        crops: [{ cropId: 'crop-tomato', quantity: 1000 }],
        acceptExtra10Percent: true,
        pickupWindow: '4:00 AM – 5:00 AM',
        deliveryRequiredBy: '7:00 AM',
        buyerName: 'Nature Fresh Supermarkets Ltd'
      });
    }, getDelay(500));

    // STEP 2: Algorithmic Knapsack Pooling (6.5s)
    const t2 = setTimeout(() => {
      setCurrentAutoDemoStep({
        stepIndex: 2,
        totalSteps: 12,
        title: '2. Knapsack Radar Discovers 3 Nearby Farmers',
        explanation: 'The pooling engine scans a 25 km radius: Ramesh (300 kg) + Mahesh (200 kg) + Suresh (500 kg) = exactly 1,000 kg target consolidated!',
        targetTab: 'buyer'
      });
    }, getDelay(6500));

    // STEP 3: Smartphone Farmer Ramesh Accepts (12.5s)
    const t3 = setTimeout(() => {
      setActiveTab('farmer');
      setSelectedFarmerId('farmer-ramesh');
      setCurrentAutoDemoStep({
        stepIndex: 3,
        totalSteps: 12,
        title: '3. Smartphone Farmer Accepts (Ramesh • 300 kg)',
        explanation: 'Ramesh Patel receives a real-time push alert with +18% higher return vs local mandi and taps ACCEPT on his smartphone.',
        targetTab: 'farmer'
      });
      sounds.playNotificationChime();
      farmerAccept('farmer-ramesh');
    }, getDelay(12500));

    // STEP 4: Keypad Farmer Mahesh Rejects via Hindi IVR (18.5s)
    const t4 = setTimeout(() => {
      setSelectedFarmerId('farmer-mahesh');
      setCurrentAutoDemoStep({
        stepIndex: 4,
        totalSteps: 12,
        title: '4. Keypad Farmer Rejection: Mahesh (Hindi IVR)',
        explanation: 'Mahesh receives an automated Hindi voice call on his keypad phone. He declines due to tractor breakdown. Standby engine automatically triggers backup!',
        targetTab: 'farmer'
      });
      sounds.playKeypadRing();
      farmerReject('farmer-mahesh', 'ट्रैक्टर खराबी के कारण आज फसल कटाई संभव नहीं।');
    }, getDelay(18500));

    // STEP 5: Standby Replacement & Suresh Accept (24.5s)
    const t5 = setTimeout(() => {
      setSelectedFarmerId('farmer-suresh');
      setCurrentAutoDemoStep({
        stepIndex: 5,
        totalSteps: 12,
        title: '5. Standby Replacement Activated & Pool 100% Filled',
        explanation: 'Standby farmer Ishwar Patel is seamlessly slotted in to replace the deficit. Suresh Patel (500 kg) accepts. Collective supply reaches the full 1,000 kg!',
        targetTab: 'farmer'
      });
      farmerAccept('farmer-suresh');
    }, getDelay(24500));

    // STEP 6: Consolidated B2B Invoice & 70% Escrow Deposit (30.5s)
    const t6 = setTimeout(() => {
      setActiveTab('buyer');
      setCurrentAutoDemoStep({
        stepIndex: 6,
        totalSteps: 12,
        title: '6. Consolidated Invoice Unlocks & 70% Escrow Locked',
        explanation: 'The buyer receives ONE unified B2B invoice covering all smallholders. Buyer deposits 70% escrow (₹16,632), unlocking refrigerated truck booking.',
        targetTab: 'buyer'
      });
      confirmOrderAndLockEscrow();
    }, getDelay(30500));

    // STEP 7: Cold-Chain Logistics Dispatched (36.5s)
    const t7 = setTimeout(() => {
      setActiveTab('logistics');
      setCurrentAutoDemoStep({
        stepIndex: 7,
        totalSteps: 12,
        title: '7. Multi-Farm Cold-Chain Pickup Run Dispatched',
        explanation: 'Refrigerated truck GJ-05-AB-1234 departs on an optimized farm-gate collection route across the agricultural cluster.',
        targetTab: 'logistics'
      });
      startPickupRun();
    }, getDelay(36500));

    // STEP 8: Stop 1 Inspection & 70% Farm-Gate Escrow Release (42.5s)
    const t8 = setTimeout(() => {
      setCurrentAutoDemoStep({
        stepIndex: 8,
        totalSteps: 12,
        title: '8. Stop 1 Verified & 70% Farm-Gate Escrow Released',
        explanation: 'Driver Arjun Singh verifies Ramesh Patel’s 300 kg harvest with digital scales and Agmark Grade A QC. 70% escrow is credited instantly at the farm gate!',
        targetTab: 'logistics'
      });
    }, getDelay(42500));

    // STEP 9: Remaining Stops Verified & Loaded (48.5s)
    const t9 = setTimeout(() => {
      setCurrentAutoDemoStep({
        stepIndex: 9,
        totalSteps: 12,
        title: '9. All Stops Inspected: 1,000 kg Secured in Bay',
        explanation: 'Remaining smallholder stops are inspected, weighed, and loaded. All farmers have received their 70% milestone. Truck is fully loaded for doorstep delivery.',
        targetTab: 'logistics'
      });
    }, getDelay(48500));

    // STEP 10: Auto-Redirect to Buyer Tracking (54.5s)
    const t10 = setTimeout(() => {
      setActiveTab('buyer');
      setCurrentAutoDemoStep({
        stepIndex: 10,
        totalSteps: 12,
        title: '10. Auto-Redirect to Buyer Tracking (30s Highway Transit)',
        explanation: 'The system automatically redirects to the Buyer Portal! The refrigerated truck cruises on the highway corridor toward Surat APMC Central Bulk Terminal.',
        targetTab: 'buyer'
      });
    }, getDelay(54500));

    // STEP 11: Truck Docks at Buyer Doorstep (60.5s)
    const t11 = setTimeout(() => {
      fastForwardTransitToDoorstep();
      setCurrentAutoDemoStep({
        stepIndex: 11,
        totalSteps: 12,
        title: '11. Truck Docks at Surat APMC Bay 4 Doorstep',
        explanation: 'The truck docks at the buyer’s facility. 1,000 kg produce is ready for final physical intake verification.',
        targetTab: 'buyer'
      });
    }, getDelay(60500));

    // STEP 12: Final 30% Escrow Released & Complete Settlement (66.5s)
    const t12 = setTimeout(() => {
      acceptDoorstepDeliveryAndRelease30Percent();
      sounds.playSuccessChime();
      setCurrentAutoDemoStep({
        stepIndex: 12,
        totalSteps: 12,
        title: '12. Final 30% Escrow Released • 100% Settlement Complete',
        explanation: 'Buyer accepts delivery! Remaining 30% escrow is released. Farmers receive final bank credit SMS & push alerts. 1,000 kg consolidated demand fulfilled without intermediaries!',
        targetTab: 'buyer'
      });
    }, getDelay(66500));

    // Tour Complete (74s)
    const t13 = setTimeout(() => {
      setIsAutoDemoRunning(false);
      setCurrentAutoDemoStep(null);
      addToast('🎉 Auto Demo Tour Completed! Feel free to explore any module.', 'success');
    }, getDelay(74000));

    autoDemoTimerRef.current = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13];
  };

  // 12. Restart Demo (Clean Reset)
  const restartDemo = () => {
    // Clear running auto-demo timers
    autoDemoTimerRef.current.forEach(clearTimeout);
    autoDemoTimerRef.current = [];
    setIsAutoDemoRunning(false);
    setCurrentAutoDemoStep(null);

    setCrops(INITIAL_CROPS);
    setFarmers(INITIAL_FARMERS);
    setSelectedFarmerId('farmer-ramesh');
    setActiveDemand(null);
    setPoolContributors([]);
    setIsMatchingActive(false);
    setRadarScanningLabel('');
    setConsolidatedInvoice(null);
    setFleet(INITIAL_FLEET);
    setPickupStops([]);
    setMatchingLogs([]);
    setToasts([]);
    setIncomingCallActive(false);
    setIvrStep(0);
    setActiveTab('buyer');

    setShortageEvent(null);
    setTransitSecondsRemaining(30);
    setIsTransitCountdownActive(false);
    setIsDoorstepPendingAcceptance(false);
    if (transitTimerRef.current) clearTimeout(transitTimerRef.current);

    addToast('Demo reset to initial state. No active demand.', 'info');
  };

  return (
    <DemoContext.Provider
      value={{
        activeTab,
        setActiveTab,
        demoSpeed,
        setDemoSpeed,
        isAutoDemoRunning,
        crops,
        farmers,
        selectedFarmerId,
        setSelectedFarmerId,
        activeDemand,
        poolContributors,
        isMatchingActive,
        radarScanningLabel,
        consolidatedInvoice,
        fleet,
        pickupStops,
        matchingLogs,
        toasts,
        shortageEvent,
        transitSecondsRemaining,
        isTransitCountdownActive,
        fastForwardTransitToDoorstep,
        isDoorstepPendingAcceptance,
        acceptDoorstepDeliveryAndRelease30Percent,
        incomingCallActive,
        setIncomingCallActive,
        ivrStep,
        setIvrStep,
        postDemand,
        farmerAccept,
        farmerReject,
        farmerCounterOffer,
        confirmOrderAndLockEscrow,
        startPickupRun,
        arriveAtStop,
        submitStopQC,
        completeFinalDelivery,
        runFullDemo,
        stopAutoDemo,
        currentAutoDemoStep,
        restartDemo,
        dismissToast,
        addToast
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within DemoProvider');
  return context;
};
