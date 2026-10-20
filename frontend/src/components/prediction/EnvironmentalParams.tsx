import React from 'react';
import { Mountain, CloudRain, Waves, Layers, Compass, Trees, Building2, Droplet, Activity } from 'lucide-react';

interface EnvironmentalParamsProps {
  features: Record<string, any>;
}

export const EnvironmentalParams: React.FC<EnvironmentalParamsProps> = ({ features }) => {
  if (!features) return null;

  const paramCards = [
    {
      code: 'DEM.ELEV',
      label: 'Elevation',
      value: `${features.elevation_m} m`,
      category: 'Topography',
      icon: Mountain,
      desc: '30m SRTM Altitude above MSL'
    },
    {
      code: 'TOPO.SLOPE',
      label: 'Slope Gradient',
      value: `${features.slope_deg}°`,
      category: 'Topography',
      icon: Compass,
      desc: 'Terrain inclination & runoff speed'
    },
    {
      code: 'HYDRO.TWI',
      label: 'Wetness Index',
      value: features.twi,
      category: 'Hydrology',
      icon: Waves,
      desc: 'Topographic flow accumulation factor'
    },
    {
      code: 'CLIM.PPT_ANN',
      label: 'Annual Rainfall',
      value: `${features.annual_rainfall_mm} mm`,
      category: 'Climate',
      icon: CloudRain,
      desc: 'Western Ghats orographic gradient'
    },
    {
      code: 'HYDRO.DIST_STRM',
      label: 'River Distance',
      value: `${features.distance_to_stream_m} m`,
      category: 'Hydrology',
      icon: Droplet,
      desc: 'Distance to Mula-Mutha river buffer'
    },
    {
      code: 'GEO.LITH_UNIT',
      label: 'Lithology Unit',
      value: features.geology_unit,
      category: 'Geology',
      icon: Layers,
      desc: `Hydraulic Score: ${features.geology_permeability_score}`
    },
    {
      code: 'SOIL.TEXTURE',
      label: 'Soil Profile',
      value: features.soil_type,
      category: 'Soil',
      icon: Layers,
      desc: `Thickness: ${features.soil_thickness_m}m | Perm: ${features.soil_permeability_cm_hr} cm/hr`
    },
    {
      code: 'RS.NDVI',
      label: 'Vegetation Index',
      value: features.ndvi,
      category: 'Remote Sensing',
      icon: Trees,
      desc: 'Sentinel-2 canopy moisture & vigor'
    },
    {
      code: 'URB.IMPERV',
      label: 'Impervious Ratio',
      value: `${features.impervious_surface_pct}%`,
      category: 'Urbanization',
      icon: Building2,
      desc: 'Concrete/asphalt recharge barrier'
    }
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Multi-Source Feature Matrix (16-D)</span>
        </h3>
        <span className="text-[10px] font-mono-code text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-500/20">
          EPSG:32643
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {paramCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-slate-950/75 border border-slate-800/90 rounded-xl p-2.5 hover:border-cyan-500/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-[9px] font-mono-code uppercase font-bold text-cyan-400/80">{c.code}</span>
                <Icon className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="text-xs font-bold font-mono-code text-slate-100 truncate" title={String(c.value)}>
                {c.value}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5" title={c.desc}>
                {c.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
