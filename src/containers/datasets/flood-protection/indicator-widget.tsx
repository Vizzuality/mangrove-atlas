import {
  floodAreaPeriodAtom,
  floodPopulationPeriodAtom,
  floodStockPeriodAtom,
} from '@/store/widgets/flood-protection';

import { useAtom } from 'jotai';

import NoData from '@/containers/widgets/no-data';

import { useMangrovesFloodProtection } from './hooks';
import type { FloodProtectionIndicatorId } from './types';
import FloodProtection from './widget';

const PERIOD_ATOMS = {
  area: floodAreaPeriodAtom,
  population: floodPopulationPeriodAtom,
  stock: floodStockPeriodAtom,
} as const;

/**
 * One indicator of the coastal-protection dataset as a standalone widget. The
 * app shows the three indicators stacked inside a single widget; the print
 * report lists them as separate cards so each sits beside the map of its own
 * layer. The period atoms are shared with the app widget, so the report prints
 * whatever period the user had selected.
 */
const FloodProtectionIndicator = ({ indicator }: { indicator: FloodProtectionIndicatorId }) => {
  const [period, setPeriod] = useAtom(PERIOD_ATOMS[indicator]);
  const { isFetched, data } = useMangrovesFloodProtection(period, { indicator });

  // NoData rather than null: inside the print report it tells the card to drop
  // itself (and its layer map) from the grid.
  if (isFetched && !data?.indicatorValues?.length) return <NoData />;

  return <FloodProtection indicator={indicator} selectedPeriod={period} setPeriod={setPeriod} />;
};

export const FloodProtectionAreaWidget = () => <FloodProtectionIndicator indicator="area" />;
export const FloodProtectionPopulationWidget = () => (
  <FloodProtectionIndicator indicator="population" />
);
export const FloodProtectionStockWidget = () => <FloodProtectionIndicator indicator="stock" />;
