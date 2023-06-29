import CoastalProtection from './coastal-protection';
import FloodProtection from './storms/widget';
import { FloodProtectionIndicatorId } from './types';

const FLOOD_PROTECTION_INDICATORS: FloodProtectionIndicatorId[] = ['area', 'population', 'stock'];

const MangrovesFloodProtection = () => {
  return (
    <div className="space-y-4">
      <CoastalProtection />
      {FLOOD_PROTECTION_INDICATORS.map((indicator) => (
        <FloodProtection key={indicator} indicator={indicator} />
      ))}
    </div>
  );
};

export default MangrovesFloodProtection;
