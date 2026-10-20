import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, Polygon, Polyline, Tooltip } from 'react-leaflet';
import { Layers, MapPin, Droplets } from 'lucide-react';
import { MonitoringWell, RasterGridPoint, PredictionResult } from '../../types';
import { NeighborhoodPresets } from './NeighborhoodPresets';

interface GisMapProps {
  wells: MonitoringWell[];
  rasterPoints: RasterGridPoint[];
  selectedLocation: { lat: number; lon: number } | null;
  prediction: PredictionResult | null;
  onSelectLocation: (lat: number, lon: number) => void;
  onSelectWell: (well: MonitoringWell) => void;
  loading: boolean;
}

function MapClickHandler({ onSelectLocation }: { onSelectLocation: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onSelectLocation(Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4)));
    },
  });
  return null;
}

export const GisMap: React.FC<GisMapProps> = ({
  wells,
  rasterPoints,
  selectedLocation,
  prediction,
  onSelectLocation,
  onSelectWell,
  loading
}) => {
  const [showPotentialMap, setShowPotentialMap] = useState(true);
  const [showWells, setShowWells] = useState(true);
  const [showDrainage, setShowDrainage] = useState(true);
  const [basemap, setBasemap] = useState<'dark' | 'satellite' | 'terrain'>('dark');

  const studyBoundary: [number, number][] = [
    [18.40, 73.70],
    [18.65, 73.70],
    [18.65, 74.00],
    [18.40, 74.00],
    [18.40, 73.70],
  ];

  const riverMutha: [number, number][] = [
    [18.4412, 73.7667], [18.4720, 73.8150], [18.5025, 73.8370], [18.5290, 73.8580],
    [18.5390, 73.8820], [18.5480, 73.9350], [18.5350, 73.9880]
  ];
  const riverMula: [number, number][] = [
    [18.5980, 73.7380], [18.5790, 73.7850], [18.5600, 73.8080], [18.5380, 73.8490], [18.5290, 73.8580]
  ];
  const riverPavana: [number, number][] = [
    [18.6250, 73.7800], [18.5950, 73.8050], [18.5700, 73.8280]
  ];

  const getTileUrl = () => {
    if (basemap === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    if (basemap === 'terrain') {
      return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }
    return 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#059669';
    if (score >= 68) return '#10b981';
    if (score >= 48) return '#eab308';
    if (score >= 30) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="relative w-full h-full">
      {/* Top Search & Presets Bar */}
      <div className="absolute top-4 left-4 z-20 max-w-xl">
        <NeighborhoodPresets onSelectLocation={onSelectLocation} />
      </div>

      <MapContainer
        center={[18.5204, 73.8567]}
        zoom={12}
        className="w-full h-full z-0 cursor-crosshair"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url={getTileUrl()}
        />

        <MapClickHandler onSelectLocation={onSelectLocation} />

        {/* Study Area Polygon */}
        <Polygon
          positions={studyBoundary}
          pathOptions={{
            color: '#0284c7',
            weight: 2,
            dashArray: '6, 6',
            fillColor: '#0284c7',
            fillOpacity: 0.03
          }}
        />

        {/* Drainage River Network */}
        {showDrainage && (
          <>
            <Polyline positions={riverMutha} pathOptions={{ color: '#38bdf8', weight: 4, opacity: 0.85 }}>
              <Tooltip sticky>Mutha River Channel (Recharge Buffer)</Tooltip>
            </Polyline>
            <Polyline positions={riverMula} pathOptions={{ color: '#38bdf8', weight: 4, opacity: 0.85 }}>
              <Tooltip sticky>Mula River Channel</Tooltip>
            </Polyline>
            <Polyline positions={riverPavana} pathOptions={{ color: '#38bdf8', weight: 3, opacity: 0.85 }}>
              <Tooltip sticky>Pavana River Tributary</Tooltip>
            </Polyline>
          </>
        )}

        {/* Continuous Groundwater Potential Raster Grid Overlay */}
        {showPotentialMap &&
          rasterPoints.map((pt, idx) => (
            <CircleMarker
              key={`pt-${idx}`}
              center={[pt.lat, pt.lon]}
              radius={8}
              pathOptions={{
                color: getScoreColor(pt.score),
                fillColor: getScoreColor(pt.score),
                fillOpacity: 0.55,
                stroke: false
              }}
              eventHandlers={{
                click: () => onSelectLocation(pt.lat, pt.lon)
              }}
            >
              <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
                <div className="text-xs p-1">
                  <div className="font-bold text-slate-100">GWP Score: {pt.score}/100</div>
                  <div className="text-[11px] text-slate-300">Category: {pt.category}</div>
                  <div className="text-[10px] text-slate-400">Elevation: {pt.elevation}m | Rain: {pt.rainfall}mm</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Monitoring Wells */}
        {showWells &&
          wells.map((well) => (
            <CircleMarker
              key={well.well_id}
              center={[well.latitude, well.longitude]}
              radius={6}
              pathOptions={{
                color: '#ffffff',
                weight: 1.5,
                fillColor: well.groundwater_potential === 'High' ? '#10b981' : well.groundwater_potential === 'Moderate' ? '#f59e0b' : '#ef4444',
                fillOpacity: 0.95
              }}
              eventHandlers={{
                click: () => onSelectWell(well)
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                <div className="text-xs font-sans">
                  <span className="font-bold text-sky-400">{well.well_name}</span>
                  <div className="text-slate-300 text-[11px]">Water Level: {well.current_water_level_mbgl} mbgl</div>
                  <div className="text-slate-400 text-[10px]">Potential: {well.groundwater_potential}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

        {/* Selected Location Target Indicator */}
        {selectedLocation && (
          <CircleMarker
            center={[selectedLocation.lat, selectedLocation.lon]}
            radius={12}
            pathOptions={{
              color: '#38bdf8',
              weight: 3,
              fillColor: '#0284c7',
              fillOpacity: 0.35,
              dashArray: '3, 3'
            }}
          >
            <Popup>
              <div className="text-xs text-slate-100 space-y-1">
                <div className="font-bold text-sky-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Target Coordinates
                </div>
                <div>Lat: {selectedLocation.lat.toFixed(4)}°N</div>
                <div>Lon: {selectedLocation.lon.toFixed(4)}°E</div>
                {prediction && (
                  <div className="mt-2 pt-2 border-t border-slate-700">
                    <span className="font-semibold text-emerald-400">Score: {prediction.potential_score}/100</span>
                    <div className="text-slate-400 text-[11px]">Potential: {prediction.groundwater_potential}</div>
                  </div>
                )}
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>

      {/* Floating Layer Controls & Basemap Switcher */}
      <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl space-y-3 w-60">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS Map Layers</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-slate-300 group-hover:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              GWP Potential Heatmap
            </span>
            <input
              type="checkbox"
              checked={showPotentialMap}
              onChange={(e) => setShowPotentialMap(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-slate-300 group-hover:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
              Monitoring Wells (180)
            </span>
            <input
              type="checkbox"
              checked={showWells}
              onChange={(e) => setShowWells(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-slate-300 group-hover:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              Mula-Mutha Drainage
            </span>
            <input
              type="checkbox"
              checked={showDrainage}
              onChange={(e) => setShowDrainage(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-sky-500 focus:ring-0"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Basemap Style</div>
          <div className="grid grid-cols-3 gap-1">
            {(['dark', 'satellite', 'terrain'] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBasemap(b)}
                className={`text-[10px] uppercase font-bold py-1 px-2 rounded transition-all ${
                  basemap === b
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Legend */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl text-xs space-y-2">
        <div className="font-bold text-slate-200 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-sky-400" />
          <span>Groundwater Potential (GWP)</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="flex flex-col items-center">
            <span className="w-6 h-2.5 rounded bg-emerald-500"></span>
            <span className="text-[9px] text-slate-400 mt-0.5">V. High</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-2.5 rounded bg-emerald-400"></span>
            <span className="text-[9px] text-slate-400 mt-0.5">High</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-2.5 rounded bg-amber-400"></span>
            <span className="text-[9px] text-slate-400 mt-0.5">Mod</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-2.5 rounded bg-orange-500"></span>
            <span className="text-[9px] text-slate-400 mt-0.5">Low</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="w-6 h-2.5 rounded bg-red-500"></span>
            <span className="text-[9px] text-slate-400 mt-0.5">V. Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};
