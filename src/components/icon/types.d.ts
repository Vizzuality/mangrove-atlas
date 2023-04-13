export interface IconProps {
  icon: {
    id: string;
    viewBox: string;
    content: string;
    node: SVGSymbolElement;
  };
  className?: string;
  style?: unknown;
}
