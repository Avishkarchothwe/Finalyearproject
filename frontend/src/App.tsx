import React, { useEffect, useState } from 'react';
import { Header } from './components/common/Header';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { GisMap } from './components/map/GisMap';
import { PredictionPanel } from './components/prediction/PredictionPanel';
import { ScenarioSimulator } from './components/prediction/ScenarioSimulator';
import { WellTrendModal } from './components/wells/WellTrendModal';
import { WellListDrawer } from './components/wells/WellListDrawer';
import { QuickStartGuideModal } from './components/common/QuickStartGuideModal';
import { ModelEvaluationView } from './components/evaluation/ModelEvaluationView';
import { DataQualityView } from './components/data/DataQualityView';
import { CapstoneDocsView } from './components/documentation/CapstoneDocsView';
import {
  fetchMonitoringWells,
  fetchPotentialMap,
  predictLocation
} from './services/api';
import { MonitoringWell, RasterGridPoint, PredictionResult } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'evaluation' | 'simulation' | 'data' | 'docs'>('map');
  const [wells, setWells] = useState<MonitoringWell[]>([]);
  const [rasterPoints, setRasterPoints] = useState<RasterGridPoint[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lon: number } | null>({
    lat: 18.5204,
    lon: 73.8567
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [selectedWell, setSelectedWell] = useState<MonitoringWell | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isWellCatalogOpen, setIsWellCatalogOpen] = useState(false);

  useEffect(() => {
    async function initData() {
      try {
        const [wList, mapData] = await Promise.all([
          fetchMonitoringWells(),
          fetchPotentialMap()
        ]);
        setWells(wList);
        if (mapData && mapData.points) {
          setRasterPoints(mapData.points);
        }
      } catch (err) {
        console.error('Failed to initialize GIS data', err);
      }
    }
    initData();
    handleLocationSelect(18.5204, 73.8567);
  }, []);

  const handleLocationSelect = async (lat: number, lon: number) => {
    setSelectedLocation({ lat, lon });
    setLoadingPrediction(true);
    try {
      const pred = await predictLocation(lat, lon);
      setPrediction(pred);
    } catch (err) {
      console.error('Prediction query failed', err);
    } finally {
      setLoadingPrediction(false);
    }
  };

  const handleWellSelect = (well: MonitoringWell) => {
    setSelectedWell(well);
    handleLocationSelect(well.latitude, well.longitude);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenWellCatalog={() => setIsWellCatalogOpen(true)}
      />
      <DisclaimerBanner />

      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'map' && (
          <div className="flex h-full w-full">
            {/* Interactive GIS Map View */}
            <div className="flex-1 h-full relative">
              <GisMap
                wells={wells}
                rasterPoints={rasterPoints}
                selectedLocation={selectedLocation}
                prediction={prediction}
                onSelectLocation={handleLocationSelect}
                onSelectWell={handleWellSelect}
                loading={loadingPrediction}
              />
            </div>

            {/* Right-Hand Prediction & XAI Intelligence Panel */}
            <div className="w-[460px] h-full bg-slate-900/95 border-l border-slate-800 shadow-2xl z-10 shrink-0">
              <PredictionPanel
                prediction={prediction}
                loading={loadingPrediction}
                onOpenSimulation={() => setActiveTab('simulation')}
              />
            </div>
          </div>
        )}

        {activeTab === 'evaluation' && <ModelEvaluationView />}

        {activeTab === 'simulation' && (
          <ScenarioSimulator
            latitude={selectedLocation?.lat || 18.5204}
            longitude={selectedLocation?.lon || 73.8567}
          />
        )}

        {activeTab === 'data' && <DataQualityView />}

        {activeTab === 'docs' && <CapstoneDocsView />}
      </main>

      {/* Monitoring Well Trend Inspector Modal */}
      {selectedWell && (
        <WellTrendModal
          well={selectedWell}
          onClose={() => setSelectedWell(null)}
        />
      )}

      {/* Monitoring Stations Slide-Out Catalog Drawer */}
      <WellListDrawer
        isOpen={isWellCatalogOpen}
        onClose={() => setIsWellCatalogOpen(false)}
        wells={wells}
        onSelectWell={handleWellSelect}
      />

      {/* Interactive Quick Start Tutorial Guide */}
      <QuickStartGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
