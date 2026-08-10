/**
 * Screen-reader alternative for a chart.
 *
 * Recharts draws an SVG whose meaning is carried entirely by shape, position
 * and colour — none of which reach assistive technology, and colour alone also
 * fails WCAG 1.4.1 for anyone who cannot distinguish the series. Rather than
 * trying to narrate the graphic, this exposes the same numbers as a real table
 * and lets the SVG be decorative.
 */
type ChartDataTableProps = {
  /** The rows the chart is drawn from. */
  data: Record<string, unknown>[];
  /** Key holding each row's category/label (falls back to `label`/`name`). */
  xKey?: string;
  /** Series keys, in the order they appear in the chart. */
  seriesKeys: string[];
  /** Accessible name for the table. */
  caption: string;
  /** Id of an existing element to name the table (e.g. the widget's <h2>). */
  labelledBy?: string | null;
};

const cellValue = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'string') return String(value);
  return '';
};

const rowLabel = (
  row: Record<string, unknown>,
  xKey: string | undefined,
  index: number
): string => {
  const candidates = [xKey ? row[xKey] : undefined, row.label, row.name];
  const found = candidates.find((c) => typeof c === 'string' || typeof c === 'number');
  return found === undefined ? `Row ${index + 1}` : String(found);
};

const ChartDataTable = ({ data, xKey, seriesKeys, caption, labelledBy }: ChartDataTableProps) => {
  if (!data?.length || !seriesKeys.length) return null;

  return (
    <table className="sr-only" aria-labelledby={labelledBy ?? undefined}>
      {/* When the table is named by the widget heading, the caption would
          repeat it, so it is only rendered as the fallback name. */}
      {!labelledBy && <caption>{caption}</caption>}
      <thead>
        <tr>
          <th scope="col">{xKey ?? 'Category'}</th>
          {seriesKeys.map((key) => (
            <th key={key} scope="col">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={rowLabel(row, xKey, index)}>
            <th scope="row">{rowLabel(row, xKey, index)}</th>
            {seriesKeys.map((key) => (
              <td key={key}>{cellValue(row[key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChartDataTable;
