import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Farmer, PickupStop, LogisticsFleet } from '../../types';
import { BUYER_LOCATION } from '../../data/mockDatabase';

// Fix Leaflet marker icons in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom HTML Icons matching prompt requirements
const createMarkerIcon = (
  type: 'buyer' | 'farmer' | 'truck',
  status?: string,
  label?: string
) => {
  let color = '#2563eb'; // blue
  let symbol = '🌾';
  let pulseClass = '';

  if (type === 'truck') {
    return L.divIcon({
      className: 'custom-m2m-truck-marker',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
          <div style="position:relative; display:flex; align-items:center; justify-content:center;">
            <div style="
              position:absolute;
              width:44px;
              height:44px;
              border-radius:50%;
              background:rgba(217, 119, 6, 0.3);
              animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width:36px;
              height:36px;
              border-radius:50%;
              background:#d97706;
              color:white;
              display:flex;
              align-items:center;
              justify-content:center;
              font-size:18px;
              border:2.5px solid white;
              box-shadow:0 4px 14px rgba(217, 119, 6, 0.6);
              position:relative;
              z-index:2;
            ">
              🚚
            </div>
          </div>
          ${
            label
              ? `<div style="
                  background:#0f172a;
                  color:#fde68a;
                  font-size:9px;
                  font-weight:800;
                  padding:2px 6px;
                  border-radius:6px;
                  margin-top:3px;
                  box-shadow:0 2px 6px rgba(0,0,0,0.4);
                  border:1px solid #d97706;
                  white-space:nowrap;
                  display:flex;
                  align-items:center;
                  gap:3px;
                ">${label}</div>`
              : ''
          }
        </div>
      `,
      iconSize: [44, 52],
      iconAnchor: [22, 26]
    });
  }

  if (type === 'buyer') {
    color = '#7e22ce'; // purple
    symbol = '🏢';
  } else if (type === 'farmer') {
    switch (status) {
      case 'Accepted':
        color = '#15803d'; // GREEN
        symbol = '✓';
        break;
      case 'Rejected':
        color = '#dc2626'; // RED
        symbol = '✕';
        break;
      case 'Pending':
        color = '#eab308'; // YELLOW
        symbol = '⏳';
        pulseClass = 'animate-pulse';
        break;
      case 'Standby':
        color = '#3b82f6'; // BLUE
        symbol = '★';
        break;
      case 'Quality Failed':
        color = '#9333ea'; // PURPLE
        symbol = '⚠';
        break;
      default:
        color = '#94a3b8'; // grey
        symbol = '🌾';
    }
  }

  return L.divIcon({
    className: 'custom-m2m-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
        <div class="${pulseClass}" style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: ${color};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: bold;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          border: 2px solid white;
        ">
          ${symbol}
        </div>
        ${
          label
            ? `<div style="
                background: white;
                color: #1e293b;
                font-size: 9px;
                font-weight: 700;
                padding: 1px 5px;
                border-radius: 4px;
                margin-top: 2px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.25);
                white-space: nowrap;
              ">${label}</div>`
            : ''
        }
      </div>
    `,
    iconSize: [36, 46],
    iconAnchor: [18, 24]
  });
};

const ChangeMapView: React.FC<{ center: [number, number]; zoom?: number }> = ({
  center,
  zoom = 10
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const LeafletMap: React.FC<{
  farmers: Farmer[];
  fleet?: LogisticsFleet;
  pickupStops?: PickupStop[];
  isMatchingActive?: boolean;
  radarScanningLabel?: string;
  height?: string;
  zoom?: number;
  highlightFarmerId?: string;
}> = ({
  farmers,
  fleet,
  pickupStops = [],
  isMatchingActive = false,
  radarScanningLabel = '',
  height = '420px',
  zoom = 10,
  highlightFarmerId
}) => {
  const center: [number, number] = [BUYER_LOCATION.lat, BUYER_LOCATION.lng];

  // Route Polyline
  const routePoints: [number, number][] = [
    [BUYER_LOCATION.lat, BUYER_LOCATION.lng],
    ...pickupStops.map((s) => [s.location.lat, s.location.lng] as [number, number]),
    ...(fleet?.deliveryStatus === 'DELIVERED' || fleet?.deliveryStatus === 'ON_THE_WAY'
      ? [[BUYER_LOCATION.lat, BUYER_LOCATION.lng] as [number, number]]
      : [])
  ];

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-stone-200 shadow-inner relative">
      {/* Impressive Professional Radar Scanning HUD Overlay */}
      {isMatchingActive && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 text-white backdrop-blur-md px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-3 border border-emerald-500/40 shadow-2xl animate-in fade-in">
          <div className="relative flex items-center justify-center w-5 h-5">
            <span className="absolute w-5 h-5 rounded-full bg-emerald-500/30 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">
                Geospatial Radar Discovery Active
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                25 km Scan
              </span>
            </div>
            <span className="text-slate-200 text-xs font-semibold">
              {radarScanningLabel || 'Aggregating fragmented smallholder lots...'}
            </span>
          </div>
        </div>
      )}

      {/* Professional Fleet Telemetry HUD (Active when truck run is running) */}
      {fleet && fleet.pickupRunsActive && (
        <div className="absolute top-4 right-4 z-20 bg-slate-950/90 text-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-amber-500/40 shadow-xl space-y-1.5 max-w-[260px] animate-in fade-in">
          <div className="flex items-center justify-between border-b border-stone-800 pb-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              {fleet.vehicleNumber}
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {fleet.speedKmH ? `${fleet.speedKmH} km/h` : 'At Farm Gate'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-mono text-stone-300">
            <div>Reefer: <strong className="text-emerald-400">{fleet.reeferTempC || 17.8}°C</strong></div>
            <div>Humidity: <strong className="text-blue-300">{fleet.reeferHumidityPercent || 88}%</strong></div>
            <div>Load: <strong className="text-amber-300">{fleet.currentLoadKg}/{fleet.capacityKg} kg</strong></div>
            <div>Driver: <strong className="text-stone-200">{fleet.driverName?.split(' ')[0]}</strong></div>
          </div>
          <div className="text-[9px] text-amber-300/80 font-mono truncate pt-0.5 border-t border-stone-800">
            {fleet.currentSegmentName || 'Farm Gate Collection Corridor'}
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <ChangeMapView center={center} zoom={zoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Professional Radar Concentric Scanning Circles around APMC Hub */}
        {isMatchingActive && (
          <>
            <Circle
              center={center}
              radius={6000}
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.12, weight: 2 }}
            />
            <Circle
              center={center}
              radius={14000}
              pathOptions={{ color: '#059669', fillColor: '#059669', fillOpacity: 0.06, weight: 1.5, dashArray: '4, 8' }}
            />
            <Circle
              center={center}
              radius={24000}
              pathOptions={{ color: '#047857', fillColor: '#047857', fillOpacity: 0.03, weight: 1, dashArray: '2, 6' }}
            />
          </>
        )}

        {/* Route Polyline when pickup stops exist */}
        {pickupStops.length > 0 && (
          <Polyline
            positions={routePoints}
            color="#d97706"
            weight={4}
            opacity={0.85}
            dashArray="6, 8"
          />
        )}

        {/* Buyer Hub Marker */}
        <Marker
          position={[BUYER_LOCATION.lat, BUYER_LOCATION.lng]}
          icon={createMarkerIcon('buyer', undefined, 'Buyer Hub (Wholesaler / Retailer)')}
        >
          <Popup>
            <div className="text-xs">
              <div className="font-extrabold text-purple-900">{BUYER_LOCATION.name}</div>
              <div className="text-stone-500">Destination: Buyer Terminal / Warehouse (Wholesaler / Retailer)</div>
            </div>
          </Popup>
        </Marker>

        {/* 15 Farmer Nodes */}
        {farmers.map((farmer) => {
          const isHighlighted = highlightFarmerId === farmer.id;
          const statusText = farmer.status;

          return (
            <Marker
              key={farmer.id}
              position={[farmer.location.lat, farmer.location.lng]}
              icon={createMarkerIcon('farmer', statusText, `${farmer.name.split(' ')[0]} (${farmer.todayAvailableQty}kg)`)}
            >
              <Popup>
                <div className="text-xs p-1 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{farmer.name}</span>
                    <span className="text-[10px] text-stone-500 font-mono">{farmer.phoneType}</span>
                  </div>
                  <div className="text-stone-600">
                    Village: <span className="font-semibold">{farmer.village}</span> ({farmer.distanceKm} km)
                  </div>
                  <div className="text-stone-600">
                    Available: <span className="font-bold text-emerald-700">{farmer.todayAvailableQty} kg {farmer.todayCrop}</span>
                  </div>
                  <div className="text-stone-600">
                    Offered Rate: <span className="font-mono font-bold">₹{farmer.offeredRate}/kg</span>
                  </div>
                  <div className="pt-1 border-t border-stone-200 flex items-center justify-between text-[10px]">
                    <span className="font-bold uppercase tracking-wider text-slate-700">Status: {farmer.status}</span>
                    {farmer.matchScore && (
                      <span className="font-bold text-emerald-700 font-mono">{farmer.matchScore}% Match</span>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Live Truck Marker */}
        {fleet && fleet.pickupRunsActive && (
          <Marker
            position={[fleet.currentLocation.lat, fleet.currentLocation.lng]}
            icon={createMarkerIcon('truck', undefined, `${fleet.vehicleNumber} • ${fleet.speedKmH ? `${fleet.speedKmH} km/h` : 'At Stop'}`)}
          >
            <Popup>
              <div className="text-xs p-1">
                <div className="font-bold text-amber-900">🚚 {fleet.fleetPartner}</div>
                <div className="text-stone-700">Vehicle: {fleet.vehicleNumber}</div>
                <div className="text-stone-700">Driver: {fleet.driverName}</div>
                <div className="text-stone-700">Load: {fleet.currentLoadKg} / {fleet.capacityKg} kg</div>
                <div className="text-emerald-700 font-bold mt-1">Status: {fleet.deliveryStatus}</div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-2 left-2 z-20 bg-white/90 backdrop-blur-xs p-2 rounded-xl text-[10px] font-bold border border-stone-200 shadow-md flex items-center gap-3">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Accepted
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span> Pending
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span> Rejected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Standby
        </span>
      </div>
    </div>
  );
};
