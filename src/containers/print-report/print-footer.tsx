/**
 * Closing line of the report.
 */
const PrintFooter = () => (
  // Screen only: on paper the reader already has the report in their hands.
  <footer className="print-report-no-print mt-4 break-inside-avoid pt-4 pb-8 text-center">
    <p className="text-lg font-light text-black/85">
      Generate your report at <span className="notranslate">globalmangrovewatch.org</span>
    </p>
  </footer>
);

export default PrintFooter;
