// Measurement units (e.g. "10m", "30 km") must keep their case inside `uppercase`
// containers — "(10m)" would otherwise render as "(10M)" (megametres).
const UNIT_REGEX = /(\d+(?:\.\d+)?\s?(?:m|km|ha)\b)/g;

const PreserveUnits = ({ children }: { children: string }) => (
  <>
    {children.split(UNIT_REGEX).map((part, index) =>
      // split() with a capture group puts matches at odd indexes
      index % 2 === 1 ? (
        <span key={index} className="normal-case">
          {part}
        </span>
      ) : (
        part
      )
    )}
  </>
);

export default PreserveUnits;
