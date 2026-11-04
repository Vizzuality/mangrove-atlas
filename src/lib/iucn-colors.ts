// Pie slice outline: white fills (e.g. Not Evaluated) get a grey inner outline so they
// don't vanish on the white card; the rest keep the default white separator so the gap
// between slices matches the other widgets' pies.
export const getIucnSliceStroke = (color?: string) =>
  color?.toUpperCase() === '#FFFFFF' ? { stroke: 'rgba(0, 0, 0, 0.15)', strokeWidth: 1 } : {};
