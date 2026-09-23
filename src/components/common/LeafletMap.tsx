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

  if (type === 'buyer') {
    color = '#7e22ce'; // purple
    symbol = '🏢';
  } else if (type === 'truck') {
    color = '#d97706'; // amber
    symbol = '🚚';
    pulseClass = 'animate-bounce';
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
      {/* Radar scanning banner overlay */}
      {isMatchingActive && (
        <>
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-stone-900/90 text-white backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-emerald-500/50 shadow-xl animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{radarScanningLabel || 'Scanning nearby farmer supply...'}</span>
          </div>

          <div className="absolute top-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md p-3 rounded-2xl border border-emerald-500/40 text-white shadow-xl text-xs space-y-1 font-mono max-w-[210px] hidden sm:block">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>RADAR TELEMETRY</span>
              </div>
              <span className="text-[9px] text-stone-400">15 km</span>
            </div>
            <div className="text-[10px] text-stone-300 leading-tight">
              Knapsack pooling active for Surat Agro-Cluster
            </div>
            <div className="text-[10px] text-emerald-300 font-bold pt-0.5 flex justify-between">
              <span>Cluster Nodes:</span>
              <span>15 Smallholders</span>
            </div>
          </div>
        </>
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

        {/* Radar concentric scanning circles around buyer center */}
        {isMatchingActive && (
          <>
            <Circle
              center={center}
              radius={6000}
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.16, weight: 2 }}
            />
            <Circle
              center={center}
              radius={14000}
              pathOptions={{ color: '#059669', fillColor: '#059669', fillOpacity: 0.09, weight: 1.5, dashArray: '4, 6' }}
            />
            <Circle
              center={center}
              radius={24000}
              pathOptions={{ color: '#047857', fillColor: '#047857', fillOpacity: 0.04, weight: 1, dashArray: '3, 8' }}
            />
          </>
        )}

        {/* Supply Pooling Rays linking matched farmers to Surat APMC Hub */}
        {farmers
          .filter((f) => ['Accepted', 'Pending', 'Rejected', 'Counter Offer', 'Standby'].includes(f.status))
          .map((f) => {
            const rayColor =
              f.status === 'Accepted'
                ? '#15803d'
                : f.status === 'Pending'
                ? '#eab308'
                : f.status === 'Rejected'
                ? '#dc2626'
                : f.status === 'Standby'
                ? '#8b5cf6'
                : '#2563eb';

            return (
              <Polyline
                key={`ray-${f.id}`}
                positions={[
                  [BUYER_LOCATION.lat, BUYER_LOCATION.lng],
                  [f.location.lat, f.location.lng]
                ]}
                color={rayColor}
                weight={f.status === 'Accepted' ? 2.5 : 1.8}
                opacity={f.status === 'Accepted' ? 0.9 : 0.65}
                dashArray={f.status === 'Accepted' ? '4, 4' : '6, 8'}
              />
            );
          })}

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
          icon={createMarkerIcon('buyer', undefined, 'Surat APMC (Buyer)')}
        >
          <Popup>
            <div className="text-xs">
              <div className="font-extrabold text-purple-900">{BUYER_LOCATION.name}</div>
              <div className="text-stone-500">Consolidated Demand Destination</div>
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
            icon={createMarkerIcon('truck', undefined, `Truck: ${fleet.vehicleNumber}`)}
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
